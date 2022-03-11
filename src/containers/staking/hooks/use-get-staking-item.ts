import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { useToasts } from '@hooks/use-toasts';
import { useIsLoading } from '@utils/dapp';

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
          await Promise.all([
            stakingItemStore.availableBalanceStore.load(),
            stakingItemStore.lastStakedTimeStore.load(),
            stakingItemStore.userStakingDelegateStore.load()
          ]);
        } catch (error) {
          showErrorToast(error as Error);
        }
      }
    },
    [isLoading, showErrorToast, stakingItemStore]
  );

  return { getStakingItem };
};
