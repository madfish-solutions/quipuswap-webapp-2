import { useEffect } from 'react';

import { amplitudeService } from '@shared/services';
import { useTranslation } from '@translation';

import { useDoHarvestAll, useGetFarmingList, useGetFarmingStats, useFarmingListStore } from '../../../../hooks';

export const useFarmingRewardsListViewModel = () => {
  const { t } = useTranslation();

  const farmingListStore = useFarmingListStore();
  const { delayedGetFarmingList } = useGetFarmingList();
  const { delayedGetFarmingStats } = useGetFarmingStats();
  const { doHarvestAll } = useDoHarvestAll();

  const handleHarvestAll = async () => {
    amplitudeService.logEvent('HARVEST_ALL_CLICK');
    await doHarvestAll(farmingListStore.listStore.data);
    await Promise.all([delayedGetFarmingList(), delayedGetFarmingStats()]);
  };

  useEffect(() => {
    farmingListStore.updatePendingRewards();
    farmingListStore.makePendingRewardsLiveable();

    return () => {
      farmingListStore.clearIntervals();
    };
  }, [farmingListStore]);

  return {
    handleHarvestAll,
    translation: {
      harvestAllTranslation: t('farm|harvestAll'),
      rewardsTooltipTranslation: t('farm|rewardsTooltip')
    }
  };
};
