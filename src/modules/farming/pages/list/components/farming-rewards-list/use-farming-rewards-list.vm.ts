import { useCallback, useEffect } from 'react';

import { amplitudeService } from '@shared/services';
import { useTranslation } from '@translation';

import {
  useDoHarvestAll,
  useGetFarmingList,
  useGetFarmingStats,
  useFarmingListStore,
  useDoHarvestAllAndRestake,
  useHarvestConfirmationPopup
} from '../../../../hooks';

export const useFarmingRewardsListViewModel = () => {
  const confirmationPopup = useHarvestConfirmationPopup();
  const { t } = useTranslation();

  const farmingListStore = useFarmingListStore();
  const { delayedGetFarmingList } = useGetFarmingList();
  const { delayedGetFarmingStats } = useGetFarmingStats();
  const { doHarvestAll } = useDoHarvestAll();
  const { doHarvestAllAndRestake } = useDoHarvestAllAndRestake();

  const yesCallback = useCallback(async () => {
    amplitudeService.logEvent('HARVEST_ALL_YES_CLICK');
    await doHarvestAllAndRestake(farmingListStore.listStore.data);
    await Promise.all([delayedGetFarmingList(), delayedGetFarmingStats()]);
  }, [delayedGetFarmingList, delayedGetFarmingStats, doHarvestAllAndRestake, farmingListStore.listStore.data]);

  const noCallback = useCallback(async () => {
    amplitudeService.logEvent('HARVEST_ALL_NO_CLICK');
    await doHarvestAll(farmingListStore.listStore.data);
    await Promise.all([delayedGetFarmingList(), delayedGetFarmingStats()]);
  }, [delayedGetFarmingList, delayedGetFarmingStats, doHarvestAll, farmingListStore.listStore.data]);

  const handleHarvestAll = async () => {
    amplitudeService.logEvent('HARVEST_ALL_CLICK');
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
