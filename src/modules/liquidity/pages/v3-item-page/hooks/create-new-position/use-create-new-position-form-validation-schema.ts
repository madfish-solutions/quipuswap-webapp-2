import { useMemo } from 'react';

import { object as objectSchema, bool as boolSchema, mixed } from 'yup';

import { EMPTY_STRING, ZERO_AMOUNT_BN } from '@config/constants';
import { useLiquidityV3CurrentPrice, useLiquidityV3PoolStore, useV3PoolPriceDecimals } from '@modules/liquidity/hooks';
import { getTokenDecimals, isNull, operationAmountSchema, stringToBigNumber, toAtomic } from '@shared/helpers';
import { BalanceToken } from '@shared/hooks';
import { numberAsStringSchema } from '@shared/validators';
import { useTranslation } from '@translation';

import { calculateTickIndex } from '../../helpers';
import { CreatePositionInput } from '../../types/create-position-form';

export const useCreateNewPositionFormValidationSchema = (tokensWithBalances: BalanceToken[]) => {
  const poolStore = useLiquidityV3PoolStore();
  const [tokenXWithBalance, tokenYWithBalance] = tokensWithBalances;
  const currentPrice = useLiquidityV3CurrentPrice();
  const { t } = useTranslation();
  const priceDecimals = useV3PoolPriceDecimals();

  return useMemo(() => {
    const requiredFieldMessage = t('common|This field is required');
    const tickSpacing = poolStore.item?.storage.constants.tick_spacing.toNumber();
    const currentPriceTickIndex =
      currentPrice && calculateTickIndex(toAtomic(currentPrice, priceDecimals), tickSpacing);

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
          const maxPriceTickIndex = maxPrice.isNaN()
            ? null
            : calculateTickIndex(toAtomic(maxPrice, priceDecimals), tickSpacing);

          return operationAmountSchema(
            tokenXWithBalance?.balance ?? null,
            isNull(currentPriceTickIndex) || isNull(maxPriceTickIndex) || currentPriceTickIndex.gte(maxPriceTickIndex),
            getTokenDecimals(tokenXWithBalance?.token)
          ).required(requiredFieldMessage);
        }
      ),
      [CreatePositionInput.SECOND_AMOUNT_INPUT]: mixed().when(
        CreatePositionInput.MIN_PRICE,
        (rawMinPrice = EMPTY_STRING) => {
          const minPrice = stringToBigNumber(rawMinPrice);
          const minPriceTickIndex = minPrice.isNaN()
            ? null
            : calculateTickIndex(toAtomic(minPrice, priceDecimals), tickSpacing);

          return operationAmountSchema(
            tokenYWithBalance?.balance ?? null,
            isNull(currentPriceTickIndex) || isNull(minPriceTickIndex) || currentPriceTickIndex.lt(minPriceTickIndex),
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
    tokenYWithBalance?.token,
    poolStore,
    priceDecimals
  ]);
};
