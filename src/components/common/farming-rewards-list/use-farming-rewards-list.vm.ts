import { useEffect } from 'react';

import { useTranslation } from 'next-i18next';

import { useDoHarvestAll } from '@containers/farming/hooks/use-do-harvest-all';
import { useGetFarmingList } from '@containers/farming/hooks/use-get-farming-list';
import { useGetFarmingStats } from '@containers/farming/hooks/use-get-farming-stats';
import { useFarmingListStore } from '@hooks/stores/use-farming-list-store';

export const useFarmingRewardsListViewModel = () => {
  const { t } = useTranslation(['farm']);

  const farmingListStore = useFarmingListStore();
  const { delayedGetFarmingList } = useGetFarmingList();
  const { delayedGetFarmingStats } = useGetFarmingStats();
  const { doHarvestAll } = useDoHarvestAll();

  const handleHarvestAll = async () => {
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
