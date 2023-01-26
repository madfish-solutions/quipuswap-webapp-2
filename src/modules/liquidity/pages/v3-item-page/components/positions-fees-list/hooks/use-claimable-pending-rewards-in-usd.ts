import { useMemo } from 'react';

import { getSumOfNumbers, isNull } from '@shared/helpers';

import { usePositionsWithStats } from '../../../hooks';

export const useClaimablePendingRewardsInUsd = () => {
  const { positionsWithStats } = usePositionsWithStats();

  return useMemo(() => {
    const addends = positionsWithStats.map(({ stats }) => stats.collectedFeesUsd);

    return addends.every(isNull) ? null : getSumOfNumbers(addends);
  }, [positionsWithStats]);
};
