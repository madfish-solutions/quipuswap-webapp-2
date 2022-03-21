import { observer } from 'mobx-react-lite';

import { PageTitle } from '@components/common/page-title';
import { StakingRewardsList } from '@components/common/staking-rewards-list';
import { TestnetAlert } from '@components/common/testnet-alert';
import { StateWrapper } from '@components/state-wrapper';
import { ListStats } from '@containers/farming/list/list-stats/list-stats';
import { useFarmingListViewModel } from '@containers/farming/list/use-faming-list.vm';

import { EmptyStakeList, StakingListSkeleton } from './components';
import styles from './farming-list.page.module.scss';
import { Iterator } from './helpers/iterator';
import { StakingListItem } from './structures';

export const FarmingListPage = observer(() => {
  const { isLoading, list } = useFarmingListViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>Farming</PageTitle>
      <ListStats />
      <StateWrapper isLoading={isLoading} loaderFallback={<StakingListSkeleton className={styles.mb48} />}>
        <StakingRewardsList />
      </StateWrapper>
      <StateWrapper isLoading={isLoading} loaderFallback={<StakingListSkeleton />}>
        <Iterator
          data={list}
          keyFn={item => item.id.toFixed()}
          render={StakingListItem}
          fallback={<EmptyStakeList />}
          isGrouped
          wrapperClassName={styles.list}
        />
      </StateWrapper>
    </>
  );
});
