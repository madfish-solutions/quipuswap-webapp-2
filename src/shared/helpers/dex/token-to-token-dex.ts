import { BigNumber } from 'bignumber.js';
import { DexTypeEnum, getTradeInputAmount, getTradeOutputAmount, Trade } from 'swap-router-sdk';

import { ZERO_AMOUNT } from '@config/constants';
import { DexPair } from '@shared/types';

import { fractionToPercentage } from '../fraction-to-percentage';
import { getTokenPairSlug } from '../tokens';

export class InputOverflowError extends Error {
  constructor(inputAmount: BigNumber, { token1, token2 }: Pick<DexPair, 'token1' | 'token2'>) {
    super(`Input amount (${inputAmount.toFixed()}) exceeds maximal one on pair ${getTokenPairSlug(token1, token2)}`);
  }
}

export class OutputOverflowError extends Error {
  constructor(outputAmount: BigNumber, { token1, token2 }: Pick<DexPair, 'token1' | 'token2'>) {
    super(`Output amount (${outputAmount.toFixed()}) exceeds maximal one on pair ${getTokenPairSlug(token1, token2)}`);
  }
}

const FALLBACK_TOKEN_MULTIPLIER = 1;
const getDexPairsAfterSwap = (trade: Trade) =>
  trade.map(({ aTokenPool, bTokenPool, aTokenAmount, bTokenAmount, ...rest }) => ({
    ...rest,
    aTokenAmount,
    bTokenAmount,
    aTokenPool: aTokenPool.plus(aTokenAmount),
    bTokenPool: bTokenPool.minus(bTokenAmount)
  }));

export const getMarketQuotient = (trade: Trade) => {
  let marketQuotient = new BigNumber(1);
  trade.forEach(tradeOperation => {
    const { aTokenPool, bTokenPool, aTokenMultiplier, bTokenMultiplier, dexType } = tradeOperation;

    if (dexType === DexTypeEnum.QuipuSwapCurveLike) {
      marketQuotient = marketQuotient
        .times(aTokenMultiplier ?? FALLBACK_TOKEN_MULTIPLIER)
        .div(bTokenMultiplier ?? FALLBACK_TOKEN_MULTIPLIER);
    } else {
      marketQuotient = marketQuotient.times(bTokenPool).div(aTokenPool);
    }
  });

  return marketQuotient;
};

const FALLBACK_PRICE_IMPACT = 99.9;
export const getPriceImpact = (trade: Trade) => {
  if (trade.every(({ dexType }) => dexType === DexTypeEnum.QuipuSwapCurveLike)) {
    let expectedRatio = new BigNumber(1);
    trade.forEach(({ aTokenMultiplier, bTokenMultiplier }) => {
      expectedRatio = expectedRatio
        .times(aTokenMultiplier ?? FALLBACK_TOKEN_MULTIPLIER)
        .div(bTokenMultiplier ?? FALLBACK_TOKEN_MULTIPLIER);
    });
    const inputAmount = getTradeInputAmount(trade);
    const outputAmount = getTradeOutputAmount(trade);

    if (inputAmount?.isFinite() && outputAmount && !outputAmount?.eq(ZERO_AMOUNT)) {
      const actualRatio = outputAmount.div(inputAmount);

      return fractionToPercentage(
        actualRatio.gt(expectedRatio)
          ? new BigNumber(1).minus(expectedRatio.div(actualRatio))
          : new BigNumber(1).minus(actualRatio.div(expectedRatio))
      );
    }

    return new BigNumber(ZERO_AMOUNT);
  }

  try {
    const initialMarketQuotient = getMarketQuotient(trade);
    const newDexPairs = getDexPairsAfterSwap(trade);
    const newMarketQuotient = getMarketQuotient(newDexPairs);

    return fractionToPercentage(
      newMarketQuotient.gt(initialMarketQuotient)
        ? new BigNumber(1).minus(initialMarketQuotient.div(newMarketQuotient))
        : new BigNumber(1).minus(newMarketQuotient.div(initialMarketQuotient))
    );
  } catch (e) {
    return new BigNumber(FALLBACK_PRICE_IMPACT);
  }
};
