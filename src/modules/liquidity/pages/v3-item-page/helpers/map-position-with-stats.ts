import BigNumber from 'bignumber.js';

import { V3LiquidityPoolApi } from '@modules/liquidity/api';
import { LiquidityV3Position } from '@modules/liquidity/types';
import { getSumOfNumbers, getTokenDecimals, isExist, multipliedIfPossible, toReal } from '@shared/helpers';
import { Optional, Token } from '@shared/types';

import { calculateDeposit } from './calculate-deposit';
import { calculateFees } from './calculate-fees';
import { convertToAtomicPrice } from './convert-to-atomic-price';

export const mapPositionWithStats = (
  tokenX: Token,
  tokenY: Token,
  currentRealPrice: Optional<BigNumber>,
  tokenXExchangeRate: Optional<BigNumber>,
  tokenYExchangeRate: Optional<BigNumber>,
  storage: V3LiquidityPoolApi.V3PoolStorage
) => {
  const tokenPriceDecimals = getTokenDecimals(tokenY) - getTokenDecimals(tokenX);
  const shouldShowUsdValues = isExist(tokenXExchangeRate) && isExist(tokenYExchangeRate);

  return (position: LiquidityV3Position) => {
    const minRange = toReal(convertToAtomicPrice(position.lower_tick.sqrt_price), tokenPriceDecimals);
    const maxRange = toReal(convertToAtomicPrice(position.upper_tick.sqrt_price), tokenPriceDecimals);

    const { x: tokenXAtomicDeposit, y: tokenYAtomicDeposit } = calculateDeposit(position, storage);
    const { x: tokenXAtomicFees, y: tokenYAtomicFees } = calculateFees(storage, position);
    const tokenXDeposit = toReal(tokenXAtomicDeposit, tokenX);
    const tokenYDeposit = toReal(tokenYAtomicDeposit, tokenY);
    const tokenXFees = toReal(tokenXAtomicFees, tokenX);
    const tokenYFees = toReal(tokenYAtomicFees, tokenY);

    const depositUsd = shouldShowUsdValues
      ? getSumOfNumbers([
          multipliedIfPossible(tokenXDeposit, tokenXExchangeRate),
          multipliedIfPossible(tokenYDeposit, tokenYExchangeRate)
        ])
      : null;
    const collectedFeesUsd = shouldShowUsdValues
      ? getSumOfNumbers([
          multipliedIfPossible(tokenXFees, tokenXExchangeRate),
          multipliedIfPossible(tokenYFees, tokenYExchangeRate)
        ])
      : null;
    const isInRange = isExist(currentRealPrice) && currentRealPrice.gte(minRange) && currentRealPrice.lt(maxRange);

    return {
      ...position,
      stats: {
        collectedFeesUsd,
        depositUsd,
        minRange,
        maxRange,
        isInRange,
        tokenXDeposit,
        tokenYDeposit,
        tokenXFees,
        tokenYFees
      }
    };
  };
};
