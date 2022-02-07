import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { mixed as mixedSchema, object as objectSchema, string as stringSchema } from 'yup';

import { DEFAULT_DEADLINE_MINS, MAX_DEADLINE_MINS, MAX_SLIPPAGE_PERCENTAGE, MIN_DEADLINE_MINS } from '@app.config';
import { useBalances } from '@providers/BalancesProvider';
import { fromDecimals, getTokenSlug } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';
import { addressSchema, bigNumberSchema } from '@utils/validators';

import { useSwapLimits } from '../providers/swap-limits-provider';
import { getUserMaxInputAmount } from '../utils/get-user-max-input-amount';
import { SwapAction, SwapField } from '../utils/types';

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
      (inputToken?: WhitelistedToken, outputToken?: WhitelistedToken) => {
        if (!inputToken) {
          return bigNumberSchema().required(t(REQUIRE_FIELD_MESSAGE));
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
