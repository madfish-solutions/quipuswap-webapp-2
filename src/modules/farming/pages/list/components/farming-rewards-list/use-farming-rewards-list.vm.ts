import { useEffect } from 'react';

import { ZERO_AMOUNT_BN } from '@config/constants';
import { QUIPU_TOKEN } from '@config/tokens';
import { isExist, toReal } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { useTranslation } from '@translation';

import {
  useFarmingListRewardsStore,
  useFarmingListStore,
  useHarvestAll,
  useHarvestAndRollStore
} from '../../../../hooks';
import { calculateTotalDeposit } from '../../helpers';

export const useFarmingRewardsListViewModel = () => {
  const { t } = useTranslation();
  const { listBalances, listBalancesStore } = useFarmingListStore();

  const farmingListRewardsStore = useFarmingListRewardsStore();
  const harvestAndRollStore = useHarvestAndRollStore();
  const { rewardsInQuipu } = harvestAndRollStore;
  const { harvestAll } = useHarvestAll();

  const handleHarvestAll = async () => {
    amplitudeService.logEvent('HARVEST_ALL_CLICK');

    if (rewardsInQuipu?.gt(ZERO_AMOUNT_BN)) {
      await harvestAndRollStore.open();
    } else {
      await harvestAll();
    }
  };

  const isBalanceLoaded = listBalances.some(({ earnBalance }) => isExist(earnBalance));

  useEffect(() => {
    (async () => {
      const _rewardsInQuipu = toReal(await farmingListRewardsStore.getQuipuPendingRewards(), QUIPU_TOKEN);
      harvestAndRollStore.setRewardsInQuipu(_rewardsInQuipu);
    })();
  }, [farmingListRewardsStore, harvestAndRollStore, isBalanceLoaded]);

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
