import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { harvestAllAssets } from '@modules/farming/api';
import { getUserInfoLastStakedTime, getEndTimestamp, getIsHarvestAvailable } from '@modules/farming/helpers';
import { useRootStore } from '@providers/root-store-provider';
import { defined, isNull } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';

import { FarmingItem } from '../../interfaces';
import { useFarmingListStore } from '../stores';
import { getPendingRewards } from './../../helpers/get-pending-rewards';

const ZERO_AMOUNT = 0;

export const useDoHarvestAll = () => {
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();

  const farmingListStore = useFarmingListStore();

  const doHarvestAll = useCallback(
    async (stakeList: FarmingItem[]) => {
      if (isNull(farmingListStore)) {
        return;
      }

      const farmingIds: BigNumber[] = stakeList
        .filter(({ earnBalance }) => earnBalance?.gt(ZERO_AMOUNT))
        .filter(farmingItem => {
          const userInfo = farmingListStore.findUserInfo(farmingItem);
          const lastStakedTime = getUserInfoLastStakedTime(userInfo);
          const endTimestamp = getEndTimestamp(farmingItem, lastStakedTime);

          return getIsHarvestAvailable(endTimestamp);
        })
        .map(({ id }) => id);

      const userEarnBalancesInUsd = stakeList.map(
        ({ earnBalance, earnExchangeRate }) => earnBalance && earnBalance.multipliedBy(earnExchangeRate ?? ZERO_AMOUNT)
      );
      const totalUserRewardsInUsd = getPendingRewards(userEarnBalancesInUsd);

      const logData = {
        harvestAll: { farmingIds: farmingIds.map(id => id.toFixed()), rewardsInUsd: totalUserRewardsInUsd.toFixed() }
      };

      try {
        amplitudeService.logEvent('HARVEST_ALL', logData);
        const operation = await harvestAllAssets(
          defined(rootStore.tezos),
          farmingIds,
          defined(rootStore.authStore.accountPkh)
        );

        await confirmOperation(operation.opHash, { message: 'Stake successful' });
        amplitudeService.logEvent('HARVEST_ALL_SUCCESS', logData);
      } catch (error) {
        showErrorToast(error as Error);
        amplitudeService.logEvent('HARVEST_ALL_FAILED', { ...logData, error });
      }
    },
    [farmingListStore, rootStore.tezos, rootStore.authStore.accountPkh, confirmOperation, showErrorToast]
  );

  return { doHarvestAll };
};
