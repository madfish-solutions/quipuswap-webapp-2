import { useEffect } from 'react';

import { isProd } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { useTranslation } from '@translation';

import {
  useDoHarvestAll,
  useFarmingListStore,
  useGetFarmingList,
  useGetFarmingStats,
  useHarvestAndRollStore
} from '../../../../hooks';

export const useFarmingRewardsListViewModel = () => {
  const { t } = useTranslation();
  const { delayedGetFarmingList } = useGetFarmingList();
  const { delayedGetFarmingStats } = useGetFarmingStats();
  const { doHarvestAll } = useDoHarvestAll();

  const farmingListStore = useFarmingListStore();
  const harvestAndRollStore = useHarvestAndRollStore();

  const handleHarvestAll = async () => {
    amplitudeService.logEvent('HARVEST_ALL_CLICK');

    if (isProd()) {
      await doHarvestAll();
      await Promise.all([delayedGetFarmingList(), delayedGetFarmingStats()]);
    }

    await harvestAndRollStore.open();
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
