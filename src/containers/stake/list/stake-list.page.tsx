import { useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { StakingRewardsList } from '@components/common/staking-rewards-list';
import { StateWrapper } from '@components/state-wrapper';
import { useAuthStore } from '@hooks/stores/use-auth-store';
import { useStakingStore } from '@hooks/stores/use-staking-store';
import { useToasts } from '@hooks/use-toasts';
import { useIsLoading } from '@utils/dapp';

import { EmptyStakeList, StakeListSkeleton } from './components';
import { Iterator } from './helpers/iterator';
import styles from './stake-list.page.module.scss';
import { StakeListItem } from './structures';

export const StakeList = observer(() => {
  const { showErrorToast } = useToasts();
  const authStore = useAuthStore();
  const stakingStore = useStakingStore();
  const isLoading = useIsLoading();
  /*
    Load data
   */
  useEffect(() => {
    const load = async () => {
      await stakingStore.list.load();
    };

    void load();
  }, [stakingStore, authStore.accountPkh]);

  /*
    Handle errors
   */
  useEffect(() => {
    if (stakingStore.list.error?.message) {
      showErrorToast(stakingStore.list.error?.message);
    }
  }, [showErrorToast, stakingStore.list.error]);

  return (
    <div>
      <StateWrapper isLoading={isLoading} loaderFallback={<StakeListSkeleton className={styles.mb48} />}>
        <StakingRewardsList />
      </StateWrapper>
      <StateWrapper isLoading={stakingStore.list.isLoading} loaderFallback={<StakeListSkeleton />}>
        <Iterator
          data={stakingStore.list.data}
          render={StakeListItem}
          fallback={<EmptyStakeList />}
          isGrouped
          wrapperClassName={styles.list}
        />
      </StateWrapper>
    </div>
  );
});
