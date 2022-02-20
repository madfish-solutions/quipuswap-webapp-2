import { observer } from 'mobx-react-lite';

import { StakingRewardsList } from '@components/common/staking-rewards-list';
import { StateWrapper } from '@components/state-wrapper';
import { useStaking } from '@containers/staking/hooks/use-staking';

import { EmptyStakeList, StakingListSkeleton } from './components';
import { Iterator } from './helpers/iterator';
import styles from './staking-list.page.module.scss';
import { StakingListItem } from './structures';

export const StakingListPage = observer(() => {
  const { isLoading, list } = useStaking();

  return (
    <div>
      <StateWrapper isLoading={isLoading} loaderFallback={<StakingListSkeleton className={styles.mb48} />}>
        <StakingRewardsList />
      </StateWrapper>
      <StateWrapper isLoading={list.isLoading} loaderFallback={<StakingListSkeleton />}>
        <Iterator
          data={list.data}
          render={StakingListItem}
          fallback={<EmptyStakeList />}
          isGrouped
          wrapperClassName={styles.list}
        />
      </StateWrapper>
    </div>
  );
});
