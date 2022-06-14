import { BigNumber } from 'bignumber.js';
import { mixed as mixedSchema, object as objectSchema, string as stringSchema } from 'yup';

import { useBalances } from '@providers/balances-provider';
import { fromDecimals, getTokenSlug, isTezosToken } from '@shared/helpers';
import { SwapTabAction, Token } from '@shared/types';
import { addressSchema, bigNumberSchema } from '@shared/validators';
import { useTranslation } from '@translation';

import { useSwapLimits } from '../providers/swap-limits-provider';
import { getUserMaxInputAmount } from '../utils/get-user-max-input-amount';
import { SwapField } from '../utils/types';

const REQUIRE_FIELD_MESSAGE = 'common|This field is required';
const TOKEN_ATOM_RAW_AMOUNT = 1;
const EMPTY_BALANCE_AMOUNT = 0;

export const useValidationSchema = () => {
  const { t } = useTranslation(['common', 'swap']);
  const { maxInputAmounts, maxOutputAmounts } = useSwapLimits();
  const { balances } = useBalances();

  return objectSchema().shape({
    [SwapField.INPUT_TOKEN]: objectSchema().required(t(REQUIRE_FIELD_MESSAGE)),
    [SwapField.OUTPUT_TOKEN]: objectSchema().required(t(REQUIRE_FIELD_MESSAGE)),
    [SwapField.INPUT_AMOUNT]: objectSchema().when(
      [SwapField.INPUT_TOKEN, SwapField.OUTPUT_TOKEN],
      // @ts-ignore
      (inputToken?: Token, outputToken?: Token) => {
        if (!inputToken) {
          return bigNumberSchema().nullable().required(t(REQUIRE_FIELD_MESSAGE));
        }
        const { decimals: inputTokenDecimals, symbol: inputTokenSymbol } = inputToken.metadata;
        const inputTokenSlug = getTokenSlug(inputToken);
        const inputTokenBalance = balances[inputTokenSlug];

        const max = getUserMaxInputAmount(
          inputToken,
          inputTokenBalance,
          outputToken && maxInputAmounts[inputTokenSlug]?.[getTokenSlug(outputToken)]
        );
        const min = fromDecimals(new BigNumber(TOKEN_ATOM_RAW_AMOUNT), inputTokenDecimals);
        if (inputTokenBalance?.eq(0)) {
          return bigNumberSchema(min)
            .test(
              'balance',
              () => t('common|Insufficient funds'),
              value => !(value instanceof BigNumber) || value.eq(EMPTY_BALANCE_AMOUNT)
            )
            .nullable()
            .required(t(REQUIRE_FIELD_MESSAGE));
        }

        return bigNumberSchema(
          min,
          max,
          max && isTezosToken(inputToken)
            ? t('swap|valueOutOfRangeError', { min: min.toFixed(), max: max.toFixed() })
            : undefined
        )
          .test(
            'input-decimals-amount',
            () =>
              t('common|tokenDecimalsOverflowError', {
                tokenSymbol: inputTokenSymbol,
                decimalPlaces: inputTokenDecimals
              }),
            value => !(value instanceof BigNumber) || value.decimalPlaces() <= inputTokenDecimals
          )
          .nullable()
          .required(t(REQUIRE_FIELD_MESSAGE));
      }
    ),
    [SwapField.OUTPUT_AMOUNT]: objectSchema().when(
      [SwapField.INPUT_TOKEN, SwapField.OUTPUT_TOKEN],
      // @ts-ignore
      (inputToken?: Token, outputToken?: Token) => {
        if (!outputToken) {
          return bigNumberSchema().nullable().required(t(REQUIRE_FIELD_MESSAGE));
        }
        const { decimals: outputTokenDecimals, symbol: outputTokenSymbol } = outputToken.metadata;
        const max = inputToken && maxOutputAmounts[getTokenSlug(inputToken)]?.[getTokenSlug(outputToken)];

        return bigNumberSchema(fromDecimals(new BigNumber(TOKEN_ATOM_RAW_AMOUNT), outputTokenDecimals), max)
          .test(
            'output-decimals-amount',
            () =>
              t('common|tokenDecimalsOverflowError', {
                tokenSymbol: outputTokenSymbol,
                decimalPlaces: outputTokenDecimals
              }),
            value => !(value instanceof BigNumber) || value.decimalPlaces() <= outputTokenDecimals
          )
          .nullable()
          .required(t(REQUIRE_FIELD_MESSAGE));
      }
    ),
    [SwapField.RECIPIENT]: mixedSchema().when(SwapField.ACTION, (currentAction: SwapTabAction) =>
      currentAction === SwapTabAction.SWAP ? mixedSchema() : addressSchema().required(t(REQUIRE_FIELD_MESSAGE))
    ),
    [SwapField.ACTION]: stringSchema().oneOf([SwapTabAction.SWAP, SwapTabAction.SEND]).required()
  });
};
