import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { mixed as mixedSchema, object as objectSchema, string as stringSchema } from 'yup';

import {
  DEFAULT_DEADLINE_MINS,
  MAX_DEADLINE_MINS,
  MAX_SLIPPAGE_PERCENTAGE,
  MIN_DEADLINE_MINS,
  TEZOS_TOKEN
} from '@app.config';
import { useBalances } from '@providers/BalancesProvider';
import { fromDecimals, getTokenSlug, isTokenEqual } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';
import { addressSchema, bigNumberSchema } from '@utils/validators';

import { useSwapLimits } from '../providers/swap-limits-provider';
import { SwapAction, SwapField } from '../utils/types';
import { useEstimateTezosCap } from './use-estimate-tezos-cap';

const REQUIRE_FIELD_MESSAGE = 'common|This field is required';
const EMPTY_BALANCE_AMOUNT = 0;
const ONE_TOKEN_ATOM_RAW_AMOUNT = 1;

export const useValidationSchema = () => {
  const { t } = useTranslation(['common', 'swap']);
  const { maxInputAmounts, maxOutputAmounts } = useSwapLimits();
  const { balances } = useBalances();
  const estimateTezosCap = useEstimateTezosCap();

  return objectSchema().shape({
    [SwapField.INPUT_TOKEN]: objectSchema().required(t(REQUIRE_FIELD_MESSAGE)),
    [SwapField.OUTPUT_TOKEN]: objectSchema().required(t(REQUIRE_FIELD_MESSAGE)),
    [SwapField.INPUT_AMOUNT]: objectSchema().when(
      [SwapField.INPUT_TOKEN, SwapField.OUTPUT_TOKEN, SwapField.DEADLINE, SwapField.SLIPPAGE, SwapField.RECIPIENT],
      // @ts-ignore
      (
        inputToken?: WhitelistedToken,
        outputToken?: WhitelistedToken,
        deadlineTimespanMins?: BigNumber,
        slippagePercentage?: BigNumber,
        recipient?: string
      ) => {
        if (!inputToken) {
          return bigNumberSchema().required(t(REQUIRE_FIELD_MESSAGE));
        }
        const { decimals: inputTokenDecimals, symbol: inputTokenSymbol } = inputToken.metadata;
        const inputTokenSlug = getTokenSlug(inputToken);
        const inputTokenBalance = balances[inputTokenSlug];
        let max: BigNumber | undefined = BigNumber.min(
          inputTokenBalance ?? new BigNumber(Infinity),
          (outputToken && maxInputAmounts[inputTokenSlug]?.[getTokenSlug(outputToken)]) ?? new BigNumber(Infinity)
        );
        if (!max.isFinite()) {
          max = undefined;
        }
        const min = fromDecimals(new BigNumber(ONE_TOKEN_ATOM_RAW_AMOUNT), inputTokenDecimals);

        const tezosCapTestFunction = isTokenEqual(inputToken, TEZOS_TOKEN)
          ? async (value: unknown) => {
              if (!(value instanceof BigNumber)) {
                return true;
              }

              const tezosCap = await estimateTezosCap({
                inputToken,
                outputToken,
                deadlineTimespanMins,
                slippagePercentage,
                recipient
              });
              // eslint-disable-next-line no-console
              console.log('tezos cap', tezosCap.toFixed());

              const tezosCapMax = BigNumber.maximum(
                EMPTY_BALANCE_AMOUNT,
                inputTokenBalance?.minus(tezosCap) ?? EMPTY_BALANCE_AMOUNT
              );

              return value.isLessThanOrEqualTo(tezosCapMax);
            }
          : async () => true;

        if (inputTokenBalance?.eq(EMPTY_BALANCE_AMOUNT)) {
          return bigNumberSchema(min)
            .test(
              'balance',
              () => t('common|Insufficient funds'),
              value => !(value instanceof BigNumber) || value.eq(EMPTY_BALANCE_AMOUNT)
            )
            .test('tezos-cap', 'pizdets', tezosCapTestFunction)
            .required(t(REQUIRE_FIELD_MESSAGE));
        }

        return bigNumberSchema(min, max)
          .test(
            'input-decimals-amount',
            () =>
              t('common|tokenDecimalsOverflowError', {
                tokenSymbol: inputTokenSymbol,
                decimalPlaces: inputTokenDecimals
              }),
            value => !(value instanceof BigNumber) || value.decimalPlaces() <= inputTokenDecimals
          )
          .test('tezos-cap', 'pizdets', tezosCapTestFunction)
          .required(t(REQUIRE_FIELD_MESSAGE));
      }
    ),
    [SwapField.OUTPUT_AMOUNT]: objectSchema().when(
      [SwapField.INPUT_TOKEN, SwapField.OUTPUT_TOKEN],
      // @ts-ignore
      (inputToken?: WhitelistedToken, outputToken?: WhitelistedToken) => {
        if (!outputToken) {
          return bigNumberSchema().required(t(REQUIRE_FIELD_MESSAGE));
        }
        const { decimals: outputTokenDecimals, symbol: outputTokenSymbol } = outputToken.metadata;
        const max = inputToken && maxOutputAmounts[getTokenSlug(inputToken)]?.[getTokenSlug(outputToken)];

        return bigNumberSchema(fromDecimals(new BigNumber(ONE_TOKEN_ATOM_RAW_AMOUNT), outputTokenDecimals), max)
          .test(
            'output-decimals-amount',
            () =>
              t('common|tokenDecimalsOverflowError', {
                tokenSymbol: outputTokenSymbol,
                decimalPlaces: outputTokenDecimals
              }),
            value => !(value instanceof BigNumber) || value.decimalPlaces() <= outputTokenDecimals
          )
          .required(t(REQUIRE_FIELD_MESSAGE));
      }
    ),
    [SwapField.RECIPIENT]: mixedSchema().when(SwapField.ACTION, (currentAction: SwapAction) =>
      currentAction === SwapAction.SWAP ? mixedSchema() : addressSchema().required(t(REQUIRE_FIELD_MESSAGE))
    ),
    [SwapField.SLIPPAGE]: bigNumberSchema(0, MAX_SLIPPAGE_PERCENTAGE).required(t(REQUIRE_FIELD_MESSAGE)),
    [SwapField.DEADLINE]: bigNumberSchema(
      MIN_DEADLINE_MINS,
      MAX_DEADLINE_MINS,
      t('common|deadlineOutOfRangeError')
    ).default(new BigNumber(DEFAULT_DEADLINE_MINS)),
    [SwapField.ACTION]: stringSchema().oneOf([SwapAction.SWAP, SwapAction.SEND]).required()
  });
};
