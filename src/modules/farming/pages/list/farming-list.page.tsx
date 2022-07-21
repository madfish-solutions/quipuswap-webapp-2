import { observer } from 'mobx-react-lite';

import { Iterator, ListItemCard, PageTitle, StateWrapper, TestnetAlert } from '@shared/components';
import { ListStats } from '@shared/components/list-stats/list-stats';

import { EmptyFarmingList, FarmingListSkeleton, FarmingRewardsList } from './components';
import styles from './farming-list.page.module.scss';
import { FarmingListFilter } from './structures';
import { useFarmingListViewModel } from './use-farming-list.vm';
import { useListStatsViewModel } from './use-list-stats.vm';

export const FarmsListPage = observer(() => {
  const { isLoading, list, title } = useFarmingListViewModel();
  const { stats } = useListStatsViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle data-test-id="farmingListPageTitle">{title}</PageTitle>
      <ListStats stats={stats} />
      <StateWrapper isLoading={isLoading} loaderFallback={<FarmingListSkeleton className={styles.mb48} />}>
        <FarmingRewardsList />
      </StateWrapper>
      <StateWrapper isLoading={isLoading} loaderFallback={<FarmingListSkeleton />}>
        <FarmingListFilter />
        <Iterator
          data={list ?? []}
          render={ListItemCard}
          fallback={<EmptyFarmingList />}
          isGrouped
          wrapperClassName={styles.list}
        />
      </StateWrapper>
    </>
  );
});
