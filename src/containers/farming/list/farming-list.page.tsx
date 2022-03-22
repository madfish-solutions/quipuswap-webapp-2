import { observer } from 'mobx-react-lite';

import { FarmingRewardsList } from '@components/common/farming-rewards-list';
import { PageTitle } from '@components/common/page-title';
import { TestnetAlert } from '@components/common/testnet-alert';
import { StateWrapper } from '@components/state-wrapper';
import { ListStats } from '@containers/farming/list/list-stats/list-stats';
import { useFarmsListViewModel } from '@containers/farming/list/use-farming-list.vm';

import { EmptyStakeList, FarmingListSkeleton } from './components';
import styles from './farming-list.page.module.scss';
import { Iterator } from './helpers/iterator';
import { FarmingListItem } from './structures';
import { ListFilter } from './structures/list-filter';

export const FarmsListPage = observer(() => {
  const { isLoading, list } = useFarmsListViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>Farming</PageTitle>
      <ListStats />
      <StateWrapper isLoading={isLoading} loaderFallback={<FarmingListSkeleton className={styles.mb48} />}>
        <FarmingRewardsList />
      </StateWrapper>
      <StateWrapper isLoading={isLoading} loaderFallback={<FarmingListSkeleton />}>
        <ListFilter />
        <Iterator
          data={list}
          keyFn={item => item.id.toFixed()}
          render={FarmingListItem}
          fallback={<EmptyStakeList />}
          isGrouped
          wrapperClassName={styles.list}
        />
      </StateWrapper>
    </>
  );
});
