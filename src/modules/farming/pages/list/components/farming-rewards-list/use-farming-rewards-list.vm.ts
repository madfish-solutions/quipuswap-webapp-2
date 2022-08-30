import { useEffect } from 'react';

import { amplitudeService } from '@shared/services';
import { useTranslation } from '@translation';

import {
  useDoHarvestAll,
  useGetFarmingList,
  useGetFarmingStats,
  useFarmingListStore,
  useHarvestAndRollStore
} from '../../../../hooks';

export const useFarmingRewardsListViewModel = () => {
  const { t } = useTranslation();

  const farmingListStore = useFarmingListStore();
  const harvestAndRollStore = useHarvestAndRollStore();
  const { delayedGetFarmingList } = useGetFarmingList();
  const { delayedGetFarmingStats } = useGetFarmingStats();
  const { doHarvestAll } = useDoHarvestAll();

  const handleHarvestAll = async () => {
    amplitudeService.logEvent('HARVEST_ALL_CLICK');

    harvestAndRollStore.open();

    if (harvestAndRollStore.opened || amplitudeService.logEvent) {
      return;
    }

    if (!farmingListStore.list) {
      return;
    }
    await doHarvestAll(farmingListStore.list);
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
