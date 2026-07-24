import { useEffect } from 'react';

import { useTranslation } from '@translation';

import { useFarmingListStore, useHarvestAll } from '../../../../hooks';
import { calculateTotalDeposit } from '../../helpers';

export const useFarmingRewardsListViewModel = () => {
  const { t } = useTranslation();
  const farmingListStore = useFarmingListStore();
  const { listBalances, listBalancesStore } = farmingListStore;

  const { harvestAll } = useHarvestAll();

  const handleHarvestAll = async () => {
    await harvestAll();
  };

  useEffect(() => {
    farmingListStore.makePendingRewardsLiveable();

    return () => {
      farmingListStore.clearIntervals();
    };
  }, [farmingListStore]);

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
