import { BigNumber } from 'bignumber.js';
import { DexTypeEnum, getTradeInputAmount, getTradeOutputAmount, Trade } from 'swap-router-sdk';

import { ZERO_AMOUNT } from '@config/constants';

import { getValueDiffPercentage } from '../percentage';

const FALLBACK_TOKEN_MULTIPLIER = 1;
const getDexPairsAfterSwap = (trade: Trade) =>
  trade.map(({ aTokenPool, bTokenPool, aTokenAmount, bTokenAmount, ...rest }) => ({
    ...rest,
    aTokenAmount,
    bTokenAmount,
    aTokenPool: aTokenPool.plus(aTokenAmount),
    bTokenPool: bTokenPool.minus(bTokenAmount)
  }));

const DEFAULT_MARKET_QUOTIENT = 1;
const getMarketQuotient = (trade: Trade) =>
  trade.reduce((marketQuotient, tradeOperation) => {
    const { aTokenPool, bTokenPool, aTokenMultiplier, bTokenMultiplier, dexType } = tradeOperation;

    if (dexType === DexTypeEnum.QuipuSwapCurveLike) {
      return marketQuotient
        .times(aTokenMultiplier ?? FALLBACK_TOKEN_MULTIPLIER)
        .div(bTokenMultiplier ?? FALLBACK_TOKEN_MULTIPLIER);
    }

    return marketQuotient.times(bTokenPool).div(aTokenPool);
  }, new BigNumber(DEFAULT_MARKET_QUOTIENT));

const isStableswapOnlyTrade = (trade: Trade) =>
  trade.every(({ dexType }) => dexType === DexTypeEnum.QuipuSwapCurveLike);

const DEFAULT_RATIO = 1;
const getStableswapOnlyTradeRatios = (trade: Trade) => {
  const inputAmount = getTradeInputAmount(trade);
  const outputAmount = getTradeOutputAmount(trade);

  if (!inputAmount?.isFinite() || !outputAmount || outputAmount.eq(ZERO_AMOUNT)) {
    return { expectedRatio: new BigNumber(DEFAULT_RATIO), actualRatio: new BigNumber(DEFAULT_RATIO) };
  }

  const expectedRatio = trade.reduce(
    (ratio, { aTokenMultiplier, bTokenMultiplier }) =>
      ratio.times(aTokenMultiplier ?? FALLBACK_TOKEN_MULTIPLIER).div(bTokenMultiplier ?? FALLBACK_TOKEN_MULTIPLIER),
    new BigNumber(DEFAULT_RATIO)
  );
  const actualRatio = outputAmount.div(inputAmount);

  return { expectedRatio, actualRatio };
};

const getMarketQuotients = (trade: Trade) => {
  const initialQuotient = getMarketQuotient(trade);
  const newDexPairs = getDexPairsAfterSwap(trade);
  const newQuotient = getMarketQuotient(newDexPairs);

  return { initialQuotient, newQuotient };
};

export const getPriceImpact = (trade: Trade) => {
  if (isStableswapOnlyTrade(trade)) {
    const { expectedRatio, actualRatio } = getStableswapOnlyTradeRatios(trade);

    return getValueDiffPercentage(expectedRatio, actualRatio);
  }

  const { initialQuotient, newQuotient } = getMarketQuotients(trade);

  return getValueDiffPercentage(initialQuotient, newQuotient);
};
