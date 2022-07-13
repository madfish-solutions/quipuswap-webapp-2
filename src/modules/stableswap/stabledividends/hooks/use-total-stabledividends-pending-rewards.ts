import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { useStableDividendsListStore } from '@modules/stableswap/hooks';

export const useTotalStableDividendsPendingRewards = () => {
  const { listWithUserInfo } = useStableDividendsListStore();
  const farmsWithRewards = useMemo(
    () => listWithUserInfo?.filter(({ yourEarnedInUsd }) => yourEarnedInUsd?.isGreaterThan('0')),
    [listWithUserInfo]
  );

  const claimablePendingRewards = useMemo(
    () => farmsWithRewards?.reduce((acc, { yourEarnedInUsd }) => acc.plus(yourEarnedInUsd), new BigNumber('0')) ?? null,
    [farmsWithRewards]
  );

  return { farmsWithRewards, claimablePendingRewards };
};
