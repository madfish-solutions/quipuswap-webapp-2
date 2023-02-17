import { useMemo } from 'react';

import { object as objectSchema, bool as boolSchema, mixed } from 'yup';

import { EMPTY_STRING, ZERO_AMOUNT_BN } from '@config/constants';
import { useV3PoolPriceDecimals, useLiquidityV3PoolStore } from '@modules/liquidity/hooks';
import {
  getInvertedValue,
  getTokenDecimals,
  isNull,
  operationAmountSchema,
  stringToBigNumber,
  toAtomic
} from '@shared/helpers';
import { BalanceToken } from '@shared/hooks';
import { numberAsStringSchema } from '@shared/validators';
import { useTranslation } from '@translation';

import { calculateTickIndex, shouldAddTokenX, shouldAddTokenY } from '../../helpers';
import { CreatePositionInput } from '../../types/create-position-form';
import { useCurrentTick } from './use-current-tick';
import { useTickSpacing } from './use-tick-spacing';

export const useCreateNewPositionFormValidationSchema = (tokensWithBalances: BalanceToken[]) => {
  const [tokenXWithBalance, tokenYWithBalance] = tokensWithBalances;
  const { t } = useTranslation();
  const priceDecimals = useV3PoolPriceDecimals();
  const currentTick = useCurrentTick();
  const tickSpacing = useTickSpacing();
  const poolStore = useLiquidityV3PoolStore();

  return useMemo(() => {
    const requiredFieldMessage = t('common|This field is required');
    const shouldShowTokenXToYPrice = poolStore.localShouldShowXToYPrice;

    return objectSchema().shape({
      [CreatePositionInput.MIN_PRICE]: mixed().when(CreatePositionInput.MAX_PRICE, (rawMaxPrice = EMPTY_STRING) => {
        const maxPrice = stringToBigNumber(rawMaxPrice);

        if (maxPrice.isNaN()) {
          return numberAsStringSchema(
            { value: ZERO_AMOUNT_BN, isInclusive: true },
            null,
            t('liquidity|priceCannotBeNegative')
          ).required(t('liquidity|minPriceIsRequired'));
        }

        return numberAsStringSchema(
          { value: ZERO_AMOUNT_BN, isInclusive: true },
          { value: maxPrice, isInclusive: true },
          t('liquidity|priceCannotBeNegative'),
          t('liquidity|minPriceLteMaxPrice')
        ).required(t('liquidity|minPriceIsRequired'));
      }),
      [CreatePositionInput.MAX_PRICE]: numberAsStringSchema(
        { value: ZERO_AMOUNT_BN, isInclusive: false },
        null,
        t('liquidity|maxPriceShouldBePositive')
      ).required(t('liquidity|maxPriceIsRequired')),
      [CreatePositionInput.FULL_RANGE_POSITION]: boolSchema().required(),
      [CreatePositionInput.FIRST_AMOUNT_INPUT]: mixed().when(
        [CreatePositionInput.MIN_PRICE, CreatePositionInput.MAX_PRICE],
        // @ts-ignore
        (rawMinPrice = EMPTY_STRING, rawMaxPrice = EMPTY_STRING) => {
          const displayedMinPrice = stringToBigNumber(rawMinPrice);
          const displayedMaxPrice = stringToBigNumber(rawMaxPrice);
          const maxPrice = shouldShowTokenXToYPrice ? getInvertedValue(displayedMinPrice) : displayedMaxPrice;
          const upperTickIndex = maxPrice.isNaN()
            ? null
            : calculateTickIndex(toAtomic(maxPrice, priceDecimals), tickSpacing);

          return operationAmountSchema(
            tokenXWithBalance?.balance ?? null,
            isNull(currentTick) || isNull(upperTickIndex) || !shouldAddTokenX(currentTick.index, upperTickIndex),
            getTokenDecimals(tokenXWithBalance?.token)
          ).required(requiredFieldMessage);
        }
      ),
      [CreatePositionInput.SECOND_AMOUNT_INPUT]: mixed().when(
        [CreatePositionInput.MIN_PRICE, CreatePositionInput.MAX_PRICE],
        // @ts-ignore
        (rawMinPrice = EMPTY_STRING, rawMaxPrice = EMPTY_STRING) => {
          const displayedMinPrice = stringToBigNumber(rawMinPrice);
          const displayedMaxPrice = stringToBigNumber(rawMaxPrice);
          const minPrice = shouldShowTokenXToYPrice ? getInvertedValue(displayedMaxPrice) : displayedMinPrice;
          const lowerTickIndex = minPrice.isNaN()
            ? null
            : calculateTickIndex(toAtomic(minPrice, priceDecimals), tickSpacing);

          return operationAmountSchema(
            tokenYWithBalance?.balance ?? null,
            isNull(currentTick) || isNull(lowerTickIndex) || !shouldAddTokenY(currentTick.index, lowerTickIndex),
            getTokenDecimals(tokenYWithBalance?.token)
          ).required(requiredFieldMessage);
        }
      )
    });
  }, [
    t,
    priceDecimals,
    tickSpacing,
    tokenXWithBalance?.balance,
    tokenXWithBalance?.token,
    currentTick,
    tokenYWithBalance?.balance,
    tokenYWithBalance?.token,
    poolStore
  ]);
};
