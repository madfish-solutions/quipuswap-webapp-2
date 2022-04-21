import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { harvestAllAssets } from '@modules/farming/api';
import { useRootStore } from '@providers/root-store-provider';
import { defined, isNull } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';

import {
  getUserInfoLastStakedTime,
  getEndTimestamp,
  getIsHarvestAvailable,
  getUserRewardsLogData
} from '../../helpers';
import { FarmingItem } from '../../interfaces';
import { useFarmingListStore } from '../stores';

const ZERO_AMOUNT = 0;

export const useDoHarvestAll = () => {
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();

  const farmingListStore = useFarmingListStore();

  const doHarvestAll = useCallback(
    async (farmingList: FarmingItem[]) => {
      if (isNull(farmingListStore)) {
        return;
      }

      const farmingIds: BigNumber[] = farmingList
        .filter(({ earnBalance }) => earnBalance?.gt(ZERO_AMOUNT))
        .filter(farmingItem => {
          const userInfo = farmingListStore.findUserInfo(farmingItem);
          const lastStakedTime = getUserInfoLastStakedTime(userInfo);
          const endTimestamp = getEndTimestamp(farmingItem, lastStakedTime);

          return getIsHarvestAvailable(endTimestamp);
        })
        .map(({ id }) => id);

      const logData = {
        harvestAll: {
          farmingIds: farmingIds.map(id => id.toFixed()),
          rewardsInUsd: getUserRewardsLogData(farmingList).toFixed()
        }
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
