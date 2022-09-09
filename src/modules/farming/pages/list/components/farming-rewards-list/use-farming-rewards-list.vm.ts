import { useEffect } from 'react';

import { amplitudeService } from '@shared/services';
import { useTranslation } from '@translation';

import { useFarmingListStore, useHarvestAndRollStore } from '../../../../hooks';

export const useFarmingRewardsListViewModel = () => {
  const { t } = useTranslation();

  const farmingListStore = useFarmingListStore();
  const harvestAndRollStore = useHarvestAndRollStore();

  const handleHarvestAll = async () => {
    amplitudeService.logEvent('HARVEST_ALL_CLICK');

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
