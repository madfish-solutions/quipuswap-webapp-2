import { useCallback, useMemo } from 'react';

import { BigNumber } from 'bignumber.js';

import { useStableFarmHarvestAll, useStableFarmListStore } from '@modules/stableswap/hooks';
import { isEmptyArray } from '@shared/helpers';
import { useTranslation } from '@translation';

export const useStableswapLiquidityRewardInfoViewModel = () => {
  const { t } = useTranslation();
  const { filteredList } = useStableFarmListStore();
  const { harvestAll: harvestAllApi } = useStableFarmHarvestAll();
  const farmsWithRewars = useMemo(
    () => filteredList?.filter(({ yourEarned }) => yourEarned?.isGreaterThan('0')),
    [filteredList]
  );

  const claimablePendingRewards = useMemo(
    () => farmsWithRewars?.reduce((acc, { yourEarned }) => acc.plus(yourEarned), new BigNumber('0')) ?? null,
    [farmsWithRewars]
  );

  const harvestAll = useCallback(async () => {
    if (!farmsWithRewars || isEmptyArray(farmsWithRewars)) {
      return;
    }

    await harvestAllApi(farmsWithRewars.map(({ contractAddress }) => contractAddress));
  }, [farmsWithRewars, harvestAllApi]);

  const harvestAllText = t('stableswap|harvestAll');

  return { claimablePendingRewards, harvestAll, harvestAllText };
};