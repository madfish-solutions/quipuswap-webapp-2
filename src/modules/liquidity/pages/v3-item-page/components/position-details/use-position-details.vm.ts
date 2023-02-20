import { SLASH } from '@config/constants';
import { TZKT_EXPLORER_URL } from '@config/environment';

import {
  useLiquidityV3PoolStore,
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
  const { tokenXSymbol, tokenYSymbol } = useLiquidityV3ItemTokensSymbols();
  const { positionsWithStats } = usePositionsWithStats();
  const { currentPrice, minPrice, maxPrice, feeBpsPercentage, tokensSymbols } = useLiquidityV3PoolStats();

  const position = findUserPosition(positionsWithStats, positionId);

  const isInRange = position?.stats.isInRange ?? false;

  const handleButtonClick = (index: number) => store.setActiveTokenIndex(index);

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
    isInRange,
    categories
  };
};
