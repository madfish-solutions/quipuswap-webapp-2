import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { DELAY_BEFORE_DATA_UPDATE } from '@app.config';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { useToasts } from '@hooks/use-toasts';
import { useIsLoading } from '@utils/dapp';
import { sleep } from '@utils/helpers/sleep';

export const useGetStakingItem = () => {
  const { showErrorToast } = useToasts();
  const stakingItemStore = useStakingItemStore();
  const isLoading = useIsLoading();

  const getStakingItem = useCallback(
    async (stakingId: BigNumber) => {
      if (!isLoading) {
        try {
          stakingItemStore.setStakingId(stakingId);
          await stakingItemStore.itemStore.load();
          await stakingItemStore.availableBalanceStore.load();
        } catch (error) {
          showErrorToast(error as Error);
        }
      }
    },
    [isLoading, showErrorToast, stakingItemStore]
  );

  const delayedGetStakingItem = useCallback(
    async (stakingId: BigNumber) => {
      await sleep(DELAY_BEFORE_DATA_UPDATE);

      await getStakingItem(stakingId);
    },
    [getStakingItem]
  );

  return { getStakingItem, delayedGetStakingItem };
};
