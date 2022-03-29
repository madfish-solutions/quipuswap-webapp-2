import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { harvestAllAssets } from '@api/farming/harvest-all-assets.api';
import { getEndTimestamp, getIsHarvestAvailable, getUserInfoLastStakedTime } from '@api/farming/helpers';
import { useFarmingItemStore } from '@hooks/stores/use-farming-item-store';
import { useToasts } from '@hooks/use-toasts';
import { FarmingItem } from '@interfaces/farming.interfaces';
import { useRootStore } from '@providers/root-store-provider';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { defined } from '@utils/helpers';

const ZERO_AMOUNT = 0;

export const useDoHarvestAll = () => {
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();
  const farmingItemStore = useFarmingItemStore();
  const { userInfoStore } = farmingItemStore;
  const { data: userInfo } = userInfoStore;

  const doHarvestAll = useCallback(
    async (stakeList: FarmingItem[]) => {
      const farmingIds: BigNumber[] = stakeList
        .filter(({ earnBalance }) => earnBalance?.gt(ZERO_AMOUNT))
        .filter(farmingItem => {
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
    [userInfo, rootStore.tezos, rootStore.authStore.accountPkh, confirmOperation, showErrorToast]
  );

  return { doHarvestAll };
};
