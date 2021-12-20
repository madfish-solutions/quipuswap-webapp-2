import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { mixed as mixedSchema, object as objectSchema, string as stringSchema } from 'yup';

import { useBalances } from '@providers/BalancesProvider';
import { MAX_SLIPPAGE_PERCENTAGE } from '@utils/defaults';
import { fromDecimals, getTokenSlug } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';
import { addressSchema, bigNumberSchema } from '@utils/validators';

import { useSwapLimits } from '../providers/swap-limits-provider';
import { SwapAction } from '../utils/types';

const REQUIRE_FIELD_MESSAGE = 'common|This field is required';

export const useValidationSchema = () => {
  const { t } = useTranslation(['common', 'swap']);
  const { maxInputAmounts, maxOutputAmounts } = useSwapLimits();
  const { balances } = useBalances();

  return objectSchema().shape({
    token1: objectSchema().required(t(REQUIRE_FIELD_MESSAGE)),
    token2: objectSchema().required(t(REQUIRE_FIELD_MESSAGE)),
    inputAmount: objectSchema().when(
      ['token1', 'token2'],
      // @ts-ignore
      (firstToken?: WhitelistedToken, secondToken?: WhitelistedToken) => {
        if (!firstToken) {
          return bigNumberSchema().required(t(REQUIRE_FIELD_MESSAGE));
        }
        const token1Balance = balances[getTokenSlug(firstToken)];
        let max: BigNumber | undefined = BigNumber.min(
          token1Balance ?? new BigNumber(Infinity),
          (secondToken && maxInputAmounts[getTokenSlug(firstToken)]?.[getTokenSlug(secondToken)]) ??
            new BigNumber(Infinity)
        );
        if (!max.isFinite()) {
          max = undefined;
        }
        const min = fromDecimals(new BigNumber(1), firstToken.metadata.decimals);
        if (token1Balance?.eq(0)) {
          return bigNumberSchema(min)
            .test(
              'balance',
              () => t('common|Insufficient funds'),
              value => !(value instanceof BigNumber) || value.eq(0)
            )
            .required(t(REQUIRE_FIELD_MESSAGE));
        }

        return bigNumberSchema(min, max).required(t(REQUIRE_FIELD_MESSAGE));
      }
    ),
    outputAmount: objectSchema().when(
      ['token1', 'token2'],
      // @ts-ignore
      (firstToken?: WhitelistedToken, secondToken?: WhitelistedToken) => {
        if (!secondToken) {
          return bigNumberSchema().required(t(REQUIRE_FIELD_MESSAGE));
        }
        const max = firstToken && maxOutputAmounts[getTokenSlug(firstToken)]?.[getTokenSlug(secondToken)];

        return bigNumberSchema(fromDecimals(new BigNumber(1), secondToken.metadata.decimals), max).required(
          t(REQUIRE_FIELD_MESSAGE)
        );
      }
    ),
    recipient: mixedSchema().when('action', (currentAction: SwapAction) =>
      currentAction === SwapAction.SWAP ? mixedSchema() : addressSchema().required(t(REQUIRE_FIELD_MESSAGE))
    ),
    slippage: bigNumberSchema(0, MAX_SLIPPAGE_PERCENTAGE).required(t(REQUIRE_FIELD_MESSAGE)),
    action: stringSchema().oneOf([SwapAction.SWAP, SwapAction.SEND]).required()
  });
};
