import { useEffect } from 'react';

import { amplitudeService } from '@shared/services';
import { useTranslation } from '@translation';

import { useFarmingListRewardsStore, useHarvestAndRollStore } from '../../../../hooks';

export const useFarmingRewardsListViewModel = () => {
  const { t } = useTranslation();

  const farmingListRewardsStore = useFarmingListRewardsStore();
  const harvestAndRollStore = useHarvestAndRollStore();

  const handleHarvestAll = async () => {
    amplitudeService.logEvent('HARVEST_ALL_CLICK');

    await harvestAndRollStore.open();
  };

  useEffect(() => {
    farmingListRewardsStore.updatePendingRewards();
    farmingListRewardsStore.makePendingRewardsLiveable();

    return () => {
      farmingListRewardsStore.clearIntervals();
    };
  }, [farmingListRewardsStore]);

  return {
    handleHarvestAll,
    translation: {
      harvestAllTranslation: t('farm|harvestAll'),
      rewardsTooltipTranslation: t('farm|rewardsTooltip')
    }
  };
};
