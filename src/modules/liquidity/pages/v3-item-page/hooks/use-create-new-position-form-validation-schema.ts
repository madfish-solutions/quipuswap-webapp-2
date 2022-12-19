import { useMemo } from 'react';

import { object as objectSchema, bool as boolSchema, mixed } from 'yup';

import { EMPTY_STRING, ZERO_AMOUNT_BN } from '@config/constants';
import { useLiquidityV3CurrentPrice } from '@modules/liquidity/hooks';
import { getTokenDecimals, operationAmountSchema, stringToBigNumber } from '@shared/helpers';
import { BalanceToken } from '@shared/hooks';
import { numberAsStringSchema } from '@shared/validators';
import { useTranslation } from '@translation';

import { CreatePositionInput } from '../types/create-position-form';

export const useCreateNewPositionFormValidationSchema = (tokensWithBalances: BalanceToken[]) => {
  const [tokenXWithBalance, tokenYWithBalance] = tokensWithBalances;
  const currentPrice = useLiquidityV3CurrentPrice();
  const { t } = useTranslation();

  return useMemo(() => {
    const requiredFieldMessage = t('common|This field is required');

    return objectSchema().shape({
      [CreatePositionInput.MIN_PRICE]: mixed().when(CreatePositionInput.MAX_PRICE, (rawMaxPrice = EMPTY_STRING) => {
        const maxPrice = stringToBigNumber(rawMaxPrice);

        if (maxPrice.isNaN()) {
          return numberAsStringSchema(
            { value: ZERO_AMOUNT_BN, isInclusive: true },
            null,
            t('liquidity|priceCannotBeNegative')
          ).required(requiredFieldMessage);
        }

        return numberAsStringSchema(
          { value: ZERO_AMOUNT_BN, isInclusive: true },
          { value: maxPrice, isInclusive: true },
          t('liquidity|priceCannotBeNegative'),
          t('liquidity|minPriceLteMaxPrice')
        ).required(requiredFieldMessage);
      }),
      [CreatePositionInput.MAX_PRICE]: numberAsStringSchema(
        { value: ZERO_AMOUNT_BN, isInclusive: false },
        null,
        t('liquidity|maxPriceShouldBePositive')
      ).required(requiredFieldMessage),
      [CreatePositionInput.FULL_RANGE_POSITION]: boolSchema().required(),
      [CreatePositionInput.FIRST_AMOUNT_INPUT]: mixed().when(
        CreatePositionInput.MAX_PRICE,
        (rawMaxPrice = EMPTY_STRING) => {
          const maxPrice = stringToBigNumber(rawMaxPrice);

          return operationAmountSchema(
            tokenXWithBalance?.balance ?? null,
            maxPrice.isNaN() || (currentPrice?.gte(rawMaxPrice) ?? true),
            getTokenDecimals(tokenXWithBalance?.token)
          ).required(requiredFieldMessage);
        }
      ),
      [CreatePositionInput.SECOND_AMOUNT_INPUT]: mixed().when(
        CreatePositionInput.MIN_PRICE,
        (rawMinPrice = EMPTY_STRING) => {
          const minPrice = stringToBigNumber(rawMinPrice);

          return operationAmountSchema(
            tokenYWithBalance?.balance ?? null,
            minPrice.isNaN() || (currentPrice?.lt(rawMinPrice) ?? true),
            getTokenDecimals(tokenYWithBalance?.token)
          ).required(requiredFieldMessage);
        }
      )
    });
  }, [
    currentPrice,
    t,
    tokenXWithBalance?.balance,
    tokenXWithBalance?.token,
    tokenYWithBalance?.balance,
    tokenYWithBalance?.token
  ]);
};
