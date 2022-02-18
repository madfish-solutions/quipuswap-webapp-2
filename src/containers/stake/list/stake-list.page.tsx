import { observer } from 'mobx-react-lite';

import { StateWrapper } from '@components/state-wrapper';
import { useToasts } from '@hooks/use-toasts';

import { useLoadOnMountStakingStore } from '../item/hooks/use-load-on-mount-staking-store';
import { EmptyStakeList, StakeListSkeleton } from './components';
import { Iterator } from './helpers/iterator';
import styles from './stake-list.page.module.scss';
import { StakeListItem } from './structures';

export const StakeList = observer(() => {
  const { showErrorToast } = useToasts();
  const stakingStore = useLoadOnMountStakingStore(showErrorToast);

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
