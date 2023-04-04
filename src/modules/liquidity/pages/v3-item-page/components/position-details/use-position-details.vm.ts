import { SLASH } from '@config/constants';
import { TZKT_EXPLORER_URL } from '@config/environment';

import { useLiquidityV3PoolStore, useLiquidityV3PositionStore, useLiquidityV3PoolStats } from '../../../../hooks';
import { findUserPosition } from '../../helpers';
import { usePositionsWithStats, useV3PoolCategories } from '../../hooks';

export const usePositionDetailsViewModel = () => {
  const { positionId } = useLiquidityV3PositionStore();
  const { contractAddress } = useLiquidityV3PoolStore();
  const { positionsWithStats } = usePositionsWithStats();
  const { currentPrice, minPrice, maxPrice, feeBpsPercentage } = useLiquidityV3PoolStats();

  const position = findUserPosition(positionsWithStats, positionId);

  const isInRange = position?.stats.isInRange ?? false;

  const categories = useV3PoolCategories();

  return {
    id: positionId,
    poolContractUrl: `${TZKT_EXPLORER_URL}${SLASH}${contractAddress}`,
    feeBps: feeBpsPercentage,
    currentPrice,
    minPrice,
    maxPrice,
    isInRange,
    categories
  };
};
