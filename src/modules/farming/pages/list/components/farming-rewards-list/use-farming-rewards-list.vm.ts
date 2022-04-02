import { useEffect } from 'react';

import { useFarmingListStore } from '@modules/farming/hooks';
import { useDoHarvestAll } from '@modules/farming/hooks/blockchain/use-do-harvest-all';
import { useGetFarmingList } from '@modules/farming/hooks/loaders/use-get-farming-list';
import { useGetFarmingStats } from '@modules/farming/hooks/loaders/use-get-farming-stats';
import { useTranslation } from '@shared/hooks';

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
