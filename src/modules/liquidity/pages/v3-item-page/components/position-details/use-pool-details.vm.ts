import { LIQUIDITY_V3_POOL_TAGS } from '@config/config';
import { EMPTY_STRING, FEE_BASE_POINTS_PRECISION, SLASH } from '@config/constants';
import { NETWORK_ID, TZKT_EXPLORER_URL } from '@config/environment';
import { getSymbolsString, isExist } from '@shared/helpers';
import { fractionToPercentage } from '@shared/helpers/percentage';

import { getCurrentPrice, getSymbolsStringByActiveToken } from '../../../../helpers';
import {
  useLiquidityV3CurrentPrice,
  useLiquidityV3PoolStore,
  useLiquidityV3ItemTokens,
  useLiquidityV3PositionStore
} from '../../../../hooks';
import { findUserPosition } from '../../helpers';
import { usePositionsWithStats } from '../../hooks';

export const usePoolDetailsViewModel = () => {
  const store = useLiquidityV3PoolStore();
  const { positionId } = useLiquidityV3PositionStore();
  const { contractAddress, feeBps } = useLiquidityV3PoolStore();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const currentPrice = useLiquidityV3CurrentPrice();
  const { positionsWithStats } = usePositionsWithStats();

  const position = findUserPosition(positionsWithStats, positionId);

  const minPrice = position?.stats.minRange;
  const maxPrice = position?.stats.maxRange;

  const isInRange = position?.stats.isInRange ?? false;

  const feeBpsPercentage = isExist(feeBps) ? fractionToPercentage(feeBps.dividedBy(FEE_BASE_POINTS_PRECISION)) : null;
  const _currentPrice = isExist(currentPrice) ? getCurrentPrice(currentPrice, store.activeTokenIndex) : null;

  const tokensSymbols = getSymbolsStringByActiveToken([tokenX, tokenY], store.activeTokenIndex);

  const handleButtonClick = (index: number) => store.setActiveTokenIndex(index);

  const priceRangeSymbols = getSymbolsString([tokenY, tokenX]);

  return {
    id: positionId,
    poolContractUrl: `${TZKT_EXPLORER_URL}${SLASH}${contractAddress}`,
    feeBps: feeBpsPercentage,
    currentPrice: _currentPrice,
    tokensSymbols,
    tokenXSymbol: tokenX?.metadata.symbol ?? EMPTY_STRING,
    tokenYSymbol: tokenY?.metadata.symbol ?? EMPTY_STRING,
    tokenActiveIndex: store.activeTokenIndex,
    handleButtonClick,
    minPrice,
    maxPrice,
    priceRangeSymbols,
    isInRange,
    categories: LIQUIDITY_V3_POOL_TAGS[NETWORK_ID][Number(store.poolId)]
  };
};
