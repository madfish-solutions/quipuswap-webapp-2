import { useEffect } from 'react';

import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';

import { useAuthStore } from '@hooks/stores/use-auth-store';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { useStakingListStore } from '@hooks/stores/use-staking-list-store';
import { useToasts } from '@hooks/use-toasts';
import { useIsLoading } from '@utils/dapp';
import { isUndefined } from '@utils/helpers';

export const useStaking = () => {
  const router = useRouter();
  const { showErrorToast } = useToasts();
  const authStore = useAuthStore();
  const stakingStore = useStakingListStore();
  const stakingFormStore = useStakingItemStore();
  const isLoading = useIsLoading();
  /*
    Load data
   */
  useEffect(() => {
    const load = async () => {
      if (!isLoading) {
        await stakingStore.list.load();
        const stakeId = router.query['id'];
        if (!isUndefined(stakeId)) {
          await stakingStore.loadStakeItem(new BigNumber(`${stakeId}`));
        }
      }
    };

    void load();
  }, [stakingStore, authStore.accountPkh, isLoading, router.query]);

  /*
    Handle errors
   */
  useEffect(() => {
    if (stakingStore.list.error?.message) {
      showErrorToast(stakingStore.list.error?.message);
    }
  }, [showErrorToast, stakingStore.list.error]);

  return {
    isLoading: isLoading || stakingStore.list.isLoading,
    list: stakingStore.list,
    error: stakingStore.list.error,
    stakeItem: stakingFormStore.stakeItem
  };
};
