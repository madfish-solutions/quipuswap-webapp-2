import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { DELAY_BEFORE_DATA_UPDATE } from '@app.config';
import { useFarmingItemStore } from '@hooks/stores/use-farming-item-store';
import { useToasts } from '@hooks/use-toasts';
import { useReady } from '@utils/dapp';
import { sleep } from '@utils/helpers/sleep';

export const useGetFarmingItem = () => {
  const { showErrorToast } = useToasts();
  const farmingItemStore = useFarmingItemStore();
  const isReady = useReady();

  const getFarmingItem = useCallback(
    async (farmingId: BigNumber) => {
      if (isReady) {
        try {
          farmingItemStore.setFarmingId(farmingId);
          await farmingItemStore.itemStore.load();
          await Promise.all([
            farmingItemStore.availableBalanceStore.load(),
            farmingItemStore.userInfoStore.load(),
            farmingItemStore.userFarmingDelegateStore.load()
          ]);
          farmingItemStore.updatePendingRewards();
        } catch (error) {
          showErrorToast(error as Error);
        }
      }
    },
    [isReady, showErrorToast, farmingItemStore]
  );

  const delayedGetFarmingItem = useCallback(
    async (farmingId: BigNumber) => {
      await sleep(DELAY_BEFORE_DATA_UPDATE);

      await getFarmingItem(farmingId);
    },
    [getFarmingItem]
  );

  return { getFarmingItem, delayedGetFarmingItem };
};
