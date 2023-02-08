import { BigNumber } from 'bignumber.js';
import { calculateXToY, calculateYToX } from 'quipuswap-v3-sdk/dist/helpers/swap';
import { Int, Nat, quipuswapV3Types } from 'quipuswap-v3-sdk/dist/types';
import { DexTypeEnum, getTradeInputAmount, getTradeOutputAmount, RouteDirectionEnum, Trade } from 'swap-router-sdk';

import { ZERO_AMOUNT } from '@config/constants';

import { getValueDiffPercentage } from '../percentage';
import { defined } from '../type-checks';
import { convertToAtomicPrice } from './convert-to-atomic-price';

const FALLBACK_TOKEN_MULTIPLIER = 1;
const getDexPairsAfterSwap = (trade: Trade) =>
  trade.map(tradeOperation => {
    const {
      aTokenPool,
      bTokenPool,
      aTokenAmount,
      bTokenAmount,
      dexType,
      direction,
      liquidity,
      sqrtPrice,
      curTickIndex,
      curTickWitness,
      ticks,
      lastCumulative,
      fees,
      ...rest
    } = tradeOperation;

    if (dexType === DexTypeEnum.QuipuSwapV3) {
      const calculationFunction = direction === RouteDirectionEnum.Direct ? calculateXToY : calculateYToX;
      try {
        const swapRequiredStorage = {
          liquidity: new Nat(defined(liquidity)),
          sqrtPrice: new quipuswapV3Types.x80n(defined(sqrtPrice)),
          curTickIndex: new Int(defined(curTickIndex)),
          curTickWitness: new Int(defined(curTickWitness)),
          lastCumulative: {
            tick: {
              sum: new Int(defined(lastCumulative).tick.sum),
              blockStartValue: new Int(defined(lastCumulative).tick.blockStartValue)
            }
          },
          ticks: Object.fromEntries(
            Object.entries(defined(ticks)).map(([key, value]) => [
              key,
              {
                sqrtPrice: new quipuswapV3Types.x80n(value.sqrtPrice),
                liquidityNet: new Int(value.liquidityNet),
                prev: new Int(value.prev),
                next: new Int(value.next),
                tickCumulativeOutside: new Int(value.tickCumulativeOutside)
              }
            ])
          ),
          constants: {
            feeBps: new Nat(defined(fees?.liquidityProvidersFee))
          }
        };

        const { newStoragePart } = calculationFunction(
          swapRequiredStorage,
          new Nat(aTokenAmount.integerValue(BigNumber.ROUND_DOWN))
        );
        const { constants, lastCumulative: newLastCumulative, ...restNewStorage } = newStoragePart;

        return {
          ...rest,
          ...restNewStorage,
          lastCumulative: {
            ...newLastCumulative,
            time: new Date().toISOString()
          },
          direction,
          dexType,
          aTokenAmount,
          bTokenAmount,
          aTokenPool: aTokenPool.plus(aTokenAmount),
          bTokenPool: bTokenPool.minus(bTokenAmount)
        };
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }

    return {
      ...rest,
      liquidity,
      sqrtPrice,
      curTickIndex,
      curTickWitness,
      ticks,
      lastCumulative,
      direction,
      dexType,
      aTokenAmount,
      bTokenAmount,
      aTokenPool: aTokenPool.plus(aTokenAmount),
      bTokenPool: bTokenPool.minus(bTokenAmount)
    };
  });

const DEFAULT_MARKET_QUOTIENT = 1;
const getMarketQuotient = (trade: Trade) =>
  trade.reduce((marketQuotient, tradeOperation) => {
    const { aTokenPool, bTokenPool, aTokenMultiplier, bTokenMultiplier, dexType } = tradeOperation;

    switch (dexType) {
      case DexTypeEnum.QuipuSwapCurveLike:
        return marketQuotient
          .times(aTokenMultiplier ?? FALLBACK_TOKEN_MULTIPLIER)
          .div(bTokenMultiplier ?? FALLBACK_TOKEN_MULTIPLIER);
      case DexTypeEnum.QuipuSwapV3:
        return marketQuotient.times(convertToAtomicPrice(defined(tradeOperation.sqrtPrice)));
      case DexTypeEnum.YupanaWtez:
        return marketQuotient;
      default:
        return marketQuotient.times(bTokenPool).div(aTokenPool);
    }
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
