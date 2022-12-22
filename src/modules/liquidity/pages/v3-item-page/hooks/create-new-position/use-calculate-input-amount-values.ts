import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { EMPTY_STRING } from '@config/constants';
import { useLiquidityV3ItemTokens } from '@modules/liquidity/hooks';
import { toAtomic, toReal } from '@shared/helpers';

import { calculateLiquidity, calculateXTokenAmount, calculateYTokenAmount, Tick } from '../../helpers';

export const useCalculateInputAmountValues = () => {
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  const calculateFirstInputValue = useCallback(
    (currentTick: Tick, upperTick: Tick, lowerTick: Tick, realYTokenAmount: BigNumber) => {
      if (realYTokenAmount.isNaN()) {
        return EMPTY_STRING;
      }

      const liquidity = calculateLiquidity(
        currentTick.index,
        lowerTick.index,
        upperTick.index,
        currentTick.price,
        lowerTick.price,
        upperTick.price,
        new BigNumber(Infinity),
        toAtomic(realYTokenAmount, tokenY)
      );
      const xTokenAtomicAmount = calculateXTokenAmount(currentTick, lowerTick, upperTick, liquidity).integerValue(
        BigNumber.ROUND_CEIL
      );

      return toReal(xTokenAtomicAmount, tokenX).toFixed();
    },
    [tokenX, tokenY]
  );

  const calculateSecondInputValue = useCallback(
    (currentTick: Tick, upperTick: Tick, lowerTick: Tick, realXTokenAmount: BigNumber) => {
      if (realXTokenAmount.isNaN()) {
        return EMPTY_STRING;
      }

      const liquidity = calculateLiquidity(
        currentTick.index,
        lowerTick.index,
        upperTick.index,
        currentTick.price,
        lowerTick.price,
        upperTick.price,
        toAtomic(realXTokenAmount, tokenX),
        new BigNumber(Infinity)
      );
      const yTokenAtomicAmount = calculateYTokenAmount(currentTick, lowerTick, upperTick, liquidity).integerValue(
        BigNumber.ROUND_CEIL
      );

      return toReal(yTokenAtomicAmount, tokenY).toFixed();
    },
    [tokenX, tokenY]
  );

  return { calculateFirstInputValue, calculateSecondInputValue };
};
