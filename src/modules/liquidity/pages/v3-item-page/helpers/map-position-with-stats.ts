import BigNumber from 'bignumber.js';

import { IS_NETWORK_MAINNET } from '@config/config';
import { TESTNET_EXCHANGE_RATE } from '@config/constants';
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
  getTokenExchangeRate: (token: Token) => Optional<BigNumber>,
  storage: V3LiquidityPoolApi.V3PoolStorage
) => {
  const tokenXExchangeRate = IS_NETWORK_MAINNET ? getTokenExchangeRate(tokenX) : TESTNET_EXCHANGE_RATE;
  const tokenYExchangeRate = IS_NETWORK_MAINNET ? getTokenExchangeRate(tokenY) : TESTNET_EXCHANGE_RATE;
  const tokenPriceDecimals = getTokenDecimals(tokenY) - getTokenDecimals(tokenX);

  return (position: LiquidityV3Position) => {
    const minRange = toReal(convertToAtomicPrice(position.lower_tick.sqrt_price), tokenPriceDecimals);
    const maxRange = toReal(convertToAtomicPrice(position.upper_tick.sqrt_price), tokenPriceDecimals);

    const { x: tokenXAtomicDeposit, y: tokenYAtomicDeposit } = calculateDeposit(position, storage);
    const { x: tokenXAtomicFees, y: tokenYAtomicFees } = calculateFees(storage, position);
    const tokenXDeposit = toReal(tokenXAtomicDeposit, tokenX);
    const tokenYDeposit = toReal(tokenYAtomicDeposit, tokenY);
    const tokenXFees = toReal(tokenXAtomicFees, tokenX);
    const tokenYFees = toReal(tokenYAtomicFees, tokenY);

    const depositUsd = getSumOfNumbers([
      multipliedIfPossible(tokenXDeposit, tokenXExchangeRate),
      multipliedIfPossible(tokenYDeposit, tokenYExchangeRate)
    ]);
    const collectedFeesUsd = getSumOfNumbers([
      multipliedIfPossible(tokenXFees, tokenXExchangeRate),
      multipliedIfPossible(tokenYFees, tokenYExchangeRate)
    ]);
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
