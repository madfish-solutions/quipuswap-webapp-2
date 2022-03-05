import { observer } from 'mobx-react-lite';

import { PageTitle } from '@components/common/page-title';
import { StakingRewardsList } from '@components/common/staking-rewards-list';
import { TestnetAlert } from '@components/common/testnet-alert';
import { StateWrapper } from '@components/state-wrapper';
import { ListStats } from '@containers/staking/list/list-stats/list-stats';
import { useStakingListViewModel } from '@containers/staking/list/use-staking-list.vm';

import { EmptyStakeList, StakingListSkeleton } from './components';
import { Iterator } from './helpers/iterator';
import styles from './staking-list.page.module.scss';
import { StakingListItem } from './structures';

export const StakingListPage = observer(() => {
  const { isLoading, list } = useStakingListViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>Staking</PageTitle>
      <ListStats />
      <StateWrapper isLoading={isLoading} loaderFallback={<StakingListSkeleton className={styles.mb48} />}>
        <StakingRewardsList />
      </StateWrapper>
      <StateWrapper isLoading={isLoading} loaderFallback={<StakingListSkeleton />}>
        <Iterator
          data={list}
          render={StakingListItem}
          fallback={<EmptyStakeList />}
          isGrouped
          wrapperClassName={styles.list}
        />
      </StateWrapper>
    </>
  );
});
