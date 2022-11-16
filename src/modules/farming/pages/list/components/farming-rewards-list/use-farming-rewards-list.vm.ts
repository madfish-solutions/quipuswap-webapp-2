import { useEffect } from 'react';

import { amplitudeService } from '@shared/services';
import { useTranslation } from '@translation';

import { useFarmingListRewardsStore, useFarmingListStore, useHarvestAndRollStore } from '../../../../hooks';
import { calculateTotalDeposit } from '../../helpers';

export const useFarmingRewardsListViewModel = () => {
  const { t } = useTranslation();
  const { listBalances, listBalancesStore } = useFarmingListStore();

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

  const userTotalDepositInfo = {
    totalDepositAmount: calculateTotalDeposit(listBalances),
    totalDepositLoading: listBalancesStore.isLoading,
    totalDepositError: listBalancesStore.error
  };
  const isUserTotalDepositExist =
    (!userTotalDepositInfo.totalDepositAmount?.isZero() || userTotalDepositInfo.totalDepositLoading) &&
    !Boolean(userTotalDepositInfo.totalDepositError);

  return {
    userTotalDepositInfo,
    isUserTotalDepositExist,
    handleHarvestAll,
    translation: {
      harvestAllTranslation: t('farm|harvestAll'),
      rewardsTooltipTranslation: t('farm|rewardsTooltip')
    }
  };
};
