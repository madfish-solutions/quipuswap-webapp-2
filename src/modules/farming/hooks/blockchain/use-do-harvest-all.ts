import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { harvestAllAssets } from '@modules/farming/api';
import { getUserInfoLastStakedTime, getEndTimestamp, getIsHarvestAvailable } from '@modules/farming/helpers';
import { useRootStore } from '@providers/root-store-provider';
import { defined, isNull } from '@shared/helpers';
import { useConfirmOperation, useToasts } from '@shared/utils';

import { FarmingItem } from '../../interfaces';
import { useFarmingListStore } from '../stores/use-farming-list-store';

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

      try {
        const operation = await harvestAllAssets(
          defined(rootStore.tezos),
          farmingIds,
          defined(rootStore.authStore.accountPkh)
        );

        await confirmOperation(operation.opHash, { message: 'Stake successful' });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error', error);
        showErrorToast(error as Error);
      }
    },
    [farmingListStore, rootStore.tezos, rootStore.authStore.accountPkh, confirmOperation, showErrorToast]
  );

  return { doHarvestAll };
};
