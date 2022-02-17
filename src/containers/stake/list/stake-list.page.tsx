import { useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { StateWrapper } from '@components/state-wrapper';
import { useStakingStore } from '@hooks/stores/use-staking-store';
import { useToasts } from '@hooks/use-toasts';

import { EmptyStakeList, StakeListSkeleton } from './components';
import { Iterator } from './helpers/iterator';
import styles from './stake-list.page.module.scss';
import { StakeListItem } from './structures';

export const StakeList = observer(() => {
  const { showErrorToast } = useToasts();
  const stakingStore = useStakingStore();

  /*
    Load data
   */
  useEffect(() => {
    void stakingStore.list.load();
  }, [stakingStore]);

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
