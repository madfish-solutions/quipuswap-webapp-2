import { useEffect } from 'react';

import { ZERO_AMOUNT_BN } from '@config/constants';
import { isExist } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { useTranslation } from '@translation';

import { useFarmingListStore, useHarvestAll, useHarvestAndRollStore, useRewards } from '../../../../hooks';
import { calculateTotalDeposit } from '../../helpers';

export const useFarmingRewardsListViewModel = () => {
  const { t } = useTranslation();
  const farmingListStore = useFarmingListStore();
  const { listBalances, listBalancesStore } = farmingListStore;

  const harvestAndRollStore = useHarvestAndRollStore();
  const { rewardsInQuipu } = harvestAndRollStore;
  const { harvestAll } = useHarvestAll();
  const { rewardsInQuipu: newRewardsInQuipu } = useRewards();

  const handleHarvestAll = async () => {
    amplitudeService.logEvent('HARVEST_ALL_CLICK');

    if (rewardsInQuipu?.gt(ZERO_AMOUNT_BN)) {
      await harvestAndRollStore.open();
    } else {
      await harvestAll(false);
    }
  };

  const isBalanceLoaded = listBalances.some(({ earnBalance }) => isExist(earnBalance));

  useEffect(
    () => harvestAndRollStore.setRewardsInQuipu(newRewardsInQuipu),
    [harvestAndRollStore, isBalanceLoaded, newRewardsInQuipu]
  );

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
