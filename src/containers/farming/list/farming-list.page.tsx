import { observer } from 'mobx-react-lite';

import { StakingRewardsList } from '@components/common/farming-rewards-list';
import { PageTitle } from '@components/common/page-title';
import { TestnetAlert } from '@components/common/testnet-alert';
import { StateWrapper } from '@components/state-wrapper';
import { ListStats } from '@containers/farming/list/list-stats/list-stats';
import { useFarmsListViewModel } from '@containers/farming/list/use-farming-list.vm';

import { EmptyStakeList, StakingListSkeleton } from './components';
import styles from './farming-list.page.module.scss';
import { Iterator } from './helpers/iterator';
import { FarmsListItem } from './structures';
import { ListFilter } from './structures/list-filter';

export const FarmsListPage = observer(() => {
  const { isLoading, list } = useFarmsListViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>Farming</PageTitle>
      <ListStats />
      <StateWrapper isLoading={isLoading} loaderFallback={<StakingListSkeleton className={styles.mb48} />}>
        <StakingRewardsList />
      </StateWrapper>
      <StateWrapper isLoading={isLoading} loaderFallback={<StakingListSkeleton />}>
        <ListFilter />
        <Iterator
          data={list}
          keyFn={item => item.id.toFixed()}
          render={FarmsListItem}
          fallback={<EmptyStakeList />}
          isGrouped
          wrapperClassName={styles.list}
        />
      </StateWrapper>
    </>
  );
});
