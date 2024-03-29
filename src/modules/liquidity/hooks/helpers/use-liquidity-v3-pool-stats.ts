import BigNumber from 'bignumber.js';

import { FEE_BASE_POINTS_PRECISION } from '@config/constants';
import { calculateV3ItemTvl, convertPrice, getSymbolsStringByActiveToken } from '@modules/liquidity/helpers';
import { findUserPosition } from '@modules/liquidity/pages/v3-item-page/helpers';
import {
  useLiquidityV3ItemTokensExchangeRates,
  usePositionsWithStats,
  useV3AprAndVolume
} from '@modules/liquidity/pages/v3-item-page/hooks';
import { getSymbolsString, isExist, toReal } from '@shared/helpers';
import { fractionToPercentage } from '@shared/helpers/percentage';

import { useLiquidityV3CurrentYToXPrice } from './use-liquidity-v3-current-y-to-x-price';
import { useLiquidityV3ItemTokens } from './use-liquidity-v3-item-tokens';
import { useLiquidityV3PoolStore, useLiquidityV3PositionStore } from '../store';

export const useLiquidityV3PoolStats = () => {
  const store = useLiquidityV3PoolStore();
  const { contractBalance, feeBps } = store;
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const currentPrice = useLiquidityV3CurrentYToXPrice();
  const { tokenXExchangeRate, tokenYExchangeRate, isExchangeRatesError } = useLiquidityV3ItemTokensExchangeRates();
  const { positionsWithStats } = usePositionsWithStats();
  const { positionId } = useLiquidityV3PositionStore();
  const { apr, volume } = useV3AprAndVolume();
  const position = findUserPosition(positionsWithStats, positionId);
  const minPrice = position?.stats.minRange;
  const maxPrice = position?.stats.maxRange;

  const { tokenXBalance, tokenYBalance } = contractBalance;

  const poolTvl = calculateV3ItemTvl(
    toReal(tokenXBalance, tokenX),
    toReal(tokenYBalance, tokenY),
    tokenXExchangeRate,
    tokenYExchangeRate
  );
  const activeTokenCurrentPrice = isExist(currentPrice) ? convertPrice(currentPrice, store.activeTokenIndex) : null;
  const convertedMinPrice = isExist(minPrice) ? convertPrice(minPrice, store.activeTokenIndex) : null;
  const convertedMaxPrice = isExist(maxPrice) ? convertPrice(maxPrice, store.activeTokenIndex) : null;
  const bothPricesDefined = isExist(convertedMinPrice) && isExist(convertedMaxPrice);
  const feeBpsPercentage = isExist(feeBps) ? fractionToPercentage(feeBps.dividedBy(FEE_BASE_POINTS_PRECISION)) : null;

  const tokensSymbols = getSymbolsStringByActiveToken([tokenY, tokenX], store.activeTokenIndex);
  const tokenYToXTokensSymbols = getSymbolsString([tokenY, tokenX]);

  return {
    isExchangeRatesError,
    poolTvl,
    currentPrice: activeTokenCurrentPrice,
    minPrice: bothPricesDefined ? BigNumber.min(convertedMinPrice, convertedMaxPrice) : null,
    maxPrice: bothPricesDefined ? BigNumber.max(convertedMinPrice, convertedMaxPrice) : null,
    feeBpsPercentage,
    tokensSymbols,
    tokenYToXCurrentPrice: currentPrice,
    tokenYToXTokensSymbols,
    apr,
    volume
  };
};
