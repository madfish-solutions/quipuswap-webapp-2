import { observer } from 'mobx-react-lite';

import { PageTitle, StateWrapper, TestnetAlert } from '@shared/components';

import { EmptyFarmingList, FarmingListSkeleton, YouvesCard } from './components';
import { FarmingRewardsList } from './components/farming-rewards-list';
import styles from './farming-list.page.module.scss';
import { Iterator } from './helpers';
import { ListStats } from './list-stats/list-stats';
import { FarmingListItem } from './structures';
import { ListFilter } from './structures/list-filter';
import { useFarmingListViewModel } from './use-farming-list.vm';

export const FarmsListPage = observer(() => {
  const { isLoading, list, title } = useFarmingListViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{title}</PageTitle>
      <ListStats />
      <StateWrapper isLoading={isLoading} loaderFallback={<FarmingListSkeleton className={styles.mb48} />}>
        <FarmingRewardsList />
      </StateWrapper>
      <YouvesCard />
      <StateWrapper isLoading={isLoading} loaderFallback={<FarmingListSkeleton />}>
        <ListFilter />
        <Iterator
          data={list ?? []}
          keyFn={item => item.id.toFixed()}
          render={FarmingListItem}
          fallback={<EmptyFarmingList />}
          isGrouped
          wrapperClassName={styles.list}
        />
      </StateWrapper>
    </>
  );
});
