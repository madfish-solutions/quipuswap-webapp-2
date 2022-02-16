import { useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { StateWrapper } from '@components/state-wrapper';
import { useStakingStore } from '@hooks/stores/use-staking-store';

import { EmptyStakeList, StakeListSkeleton } from './components';
import { Iterator } from './helpers/iterator';
import styles from './stake-list.page.module.scss';
import { StakeListItem } from './structures';

export const StakeList = observer(() => {
  const stakingStore = useStakingStore();

  useEffect(() => {
    void stakingStore.list.load();
    void stakingStore.stats.load();
  }, [stakingStore]);

  return (
    <div>
      <StateWrapper isLoading={stakingStore.list.isLoading} loaderFallback={<StakeListSkeleton />}>
        <Iterator
          data={stakingStore.list.data || []}
          render={StakeListItem}
          fallback={<EmptyStakeList />}
          isGrouped
          wrapperClassName={styles.list}
        />
      </StateWrapper>
    </div>
  );
});
