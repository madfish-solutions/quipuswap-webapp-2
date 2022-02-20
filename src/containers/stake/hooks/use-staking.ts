import { useEffect } from 'react';

import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';

import { useAuthStore } from '@hooks/stores/use-auth-store';
import { useStakingStore } from '@hooks/stores/use-staking-store';
import { useToasts } from '@hooks/use-toasts';
import { useIsLoading } from '@utils/dapp';
import { isUndefined } from '@utils/helpers';

export const useStaking = () => {
  const router = useRouter();
  const { showErrorToast } = useToasts();
  const authStore = useAuthStore();
  const stakingStore = useStakingStore();
  const isLoading = useIsLoading();
  /*
    Load data
   */
  useEffect(() => {
    const load = async () => {
      if (!isLoading) {
        await stakingStore.list.load();
      }
    };

    void load();
  }, [stakingStore, authStore.accountPkh, isLoading]);

  /*
    Handle errors
   */
  useEffect(() => {
    if (stakingStore.list.error?.message) {
      showErrorToast(stakingStore.list.error?.message);
    }
  }, [showErrorToast, stakingStore.list.error]);

  const stakeId = router.query['id'];
  const stakeItem = isUndefined(stakeId) ? undefined : stakingStore.defineStake(new BigNumber(`${stakeId}`));

  return {
    isLoading: isLoading || stakingStore.list.isLoading,
    list: stakingStore.list,
    error: stakingStore.list.error,
    stakeItem
  };
};
