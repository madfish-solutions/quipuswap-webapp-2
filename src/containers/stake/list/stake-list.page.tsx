import { observer } from 'mobx-react-lite';

import { StakingRewardsList } from '@components/common/staking-rewards-list';
import { StateWrapper } from '@components/state-wrapper';
import { useStaking } from '@containers/stake/hooks/use-staking';

import { EmptyStakeList, StakeListSkeleton } from './components';
import { Iterator } from './helpers/iterator';
import styles from './stake-list.page.module.scss';
import { StakeListItem } from './structures';

export const StakeListPage = observer(() => {
  const { isLoading, list } = useStaking();

  return (
    <div>
      <StateWrapper isLoading={isLoading} loaderFallback={<StakeListSkeleton className={styles.mb48} />}>
        <StakingRewardsList />
      </StateWrapper>
      <StateWrapper isLoading={list.isLoading} loaderFallback={<StakeListSkeleton />}>
        <Iterator
          data={list.data}
          render={StakeListItem}
          fallback={<EmptyStakeList />}
          isGrouped
          wrapperClassName={styles.list}
        />
      </StateWrapper>
    </div>
  );
});
