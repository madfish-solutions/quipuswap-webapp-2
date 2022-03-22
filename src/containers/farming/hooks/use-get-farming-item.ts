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
    async (stakingId: BigNumber) => {
      if (isReady) {
        try {
          farmingItemStore.setStakingId(stakingId);
          await farmingItemStore.itemStore.load();
          await Promise.all([
            farmingItemStore.availableBalanceStore.load(),
            farmingItemStore.lastStakedTimeStore.load(),
            farmingItemStore.userStakingDelegateStore.load()
          ]);
        } catch (error) {
          showErrorToast(error as Error);
        }
      }
    },
    [isReady, showErrorToast, farmingItemStore]
  );

  const delayedGetFarmingItem = useCallback(
    async (stakingId: BigNumber) => {
      await sleep(DELAY_BEFORE_DATA_UPDATE);

      await getFarmingItem(stakingId);
    },
    [getFarmingItem]
  );

  return { getFarmingItem, delayedGetFarmingItem };
};
