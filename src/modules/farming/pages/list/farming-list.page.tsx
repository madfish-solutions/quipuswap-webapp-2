import { observer } from 'mobx-react-lite';

import { Iterator, ListItemCard, PageTitle, StateWrapper, TestnetAlert, ListStats } from '@shared/components';

import { EmptyFarmingList, FarmingListSkeleton, FarmingRewardsList } from './components';
import styles from './farming-list.page.module.scss';
import { FarmingListFilter } from './structures';
import { useFarmingListPageViewModel } from './use-farming-list-page.vm';
import { useListStatsViewModel } from './use-list-stats.vm';
import { HarvestAndRollModal } from '../../modals/harvest-and-roll-modal/harvest-and-roll-modal';

export const FarmsListPage = observer(() => {
  const { isLoading, farmings, title, opened } = useFarmingListPageViewModel();
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
          data={farmings}
          render={ListItemCard}
          fallback={<EmptyFarmingList />}
          isGrouped
          wrapperClassName={styles.list}
          DTI="farmingList"
        />
      </StateWrapper>
      <HarvestAndRollModal opened={opened} />
    </>
  );
});
