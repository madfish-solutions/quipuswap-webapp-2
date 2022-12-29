import { SLASH } from '@config/constants';
import { TZKT_EXPLORER_URL } from '@config/environment';
import { getSymbolsString } from '@shared/helpers';

import {
  useLiquidityV3PoolStore,
  useLiquidityV3ItemTokens,
  useLiquidityV3PositionStore,
  useLiquidityV3PoolStats,
  useLiquidityV3ItemTokensSymbols
} from '../../../../hooks';
import { findUserPosition } from '../../helpers';
import { usePositionsWithStats, useV3PoolCategories } from '../../hooks';

export const usePositionDetailsViewModel = () => {
  const store = useLiquidityV3PoolStore();
  const { positionId } = useLiquidityV3PositionStore();
  const { contractAddress } = useLiquidityV3PoolStore();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const { tokenXSymbol, tokenYSymbol } = useLiquidityV3ItemTokensSymbols();
  const { positionsWithStats } = usePositionsWithStats();
  const { currentPrice, feeBpsPercentage, tokensSymbols } = useLiquidityV3PoolStats();

  const position = findUserPosition(positionsWithStats, positionId);

  const minPrice = position?.stats.minRange;
  const maxPrice = position?.stats.maxRange;

  const isInRange = position?.stats.isInRange ?? false;

  const handleButtonClick = (index: number) => store.setActiveTokenIndex(index);

  const priceRangeSymbols = getSymbolsString([tokenY, tokenX]);

  const categories = useV3PoolCategories();

  return {
    id: positionId,
    poolContractUrl: `${TZKT_EXPLORER_URL}${SLASH}${contractAddress}`,
    feeBps: feeBpsPercentage,
    currentPrice,
    tokensSymbols,
    tokenXSymbol,
    tokenYSymbol,
    tokenActiveIndex: store.activeTokenIndex,
    handleButtonClick,
    minPrice,
    maxPrice,
    priceRangeSymbols,
    isInRange,
    categories
  };
};
