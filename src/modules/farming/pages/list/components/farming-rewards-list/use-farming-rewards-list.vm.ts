import { useCallback, useEffect } from 'react';

import { useFarmingListStore, useDoHarvestAll, useDoHarvestAllAndRestake } from '@modules/farming/hooks';
import { useGetFarmingList } from '@modules/farming/hooks/loaders/use-get-farming-list';
import { useGetFarmingStats } from '@modules/farming/hooks/loaders/use-get-farming-stats';
import { useTranslation } from '@translation';

import { useHarvestConfirmationPopup } from './use-harvest-confirmation-popup';

export const useFarmingRewardsListViewModel = () => {
  const confirmationPopup = useHarvestConfirmationPopup();
  const { t } = useTranslation();

  const farmingListStore = useFarmingListStore();
  const { delayedGetFarmingList } = useGetFarmingList();
  const { delayedGetFarmingStats } = useGetFarmingStats();
  const { doHarvestAll } = useDoHarvestAll();
  const { doHarvestAllAndRestake } = useDoHarvestAllAndRestake();

  const yesCallback = useCallback(async () => {
    await doHarvestAllAndRestake(farmingListStore.listStore.data);
    await Promise.all([delayedGetFarmingList(), delayedGetFarmingStats()]);
  }, [delayedGetFarmingList, delayedGetFarmingStats, doHarvestAllAndRestake, farmingListStore.listStore.data]);

  const noCallback = useCallback(async () => {
    await doHarvestAll(farmingListStore.listStore.data);

    await Promise.all([delayedGetFarmingList(), delayedGetFarmingStats()]);
  }, [delayedGetFarmingList, delayedGetFarmingStats, doHarvestAll, farmingListStore.listStore.data]);

  const handleHarvestAll = async () => {
    confirmationPopup(yesCallback, noCallback);
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
