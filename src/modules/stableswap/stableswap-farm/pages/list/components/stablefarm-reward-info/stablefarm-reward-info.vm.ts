import { useCallback, useMemo } from 'react';

import { BigNumber } from 'bignumber.js';

import { useStableFarmHarvestAll, useStableFarmListStore } from '@modules/stableswap/hooks';
import { isEmptyArray } from '@shared/helpers';
import { useTranslation } from '@translation';

export const useStableswapLiquidityRewardInfoViewModel = () => {
  const { t } = useTranslation();
  const { filteredList } = useStableFarmListStore();
  const { harvestAll: harvestAllApi } = useStableFarmHarvestAll();
  const farmsWithRewars = useMemo(() => {
    return filteredList?.filter(({ yourEarned }) => {
      return yourEarned?.isGreaterThan('0');
    });
  }, [filteredList]);

  const claimablePendingRewards = useMemo(() => {
    return (
      farmsWithRewars?.reduce((acc, { yourEarned }) => {
        return acc.plus(yourEarned);
      }, new BigNumber('0')) ?? null
    );
  }, [farmsWithRewars]);

  const harvestAll = useCallback(() => {
    if (!farmsWithRewars || isEmptyArray(farmsWithRewars)) {
      return;
    }

    harvestAllApi(farmsWithRewars.map(({ contractAddress }) => contractAddress));
  }, [farmsWithRewars, harvestAllApi]);

  const harvestAllText = t('stableswap|harvestAll');

  return { claimablePendingRewards, harvestAll, harvestAllText };
};
