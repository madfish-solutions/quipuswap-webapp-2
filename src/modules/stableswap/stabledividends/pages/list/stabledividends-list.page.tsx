import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Iterator, ListItemCard, LoaderFallback, PageTitle, StateWrapper, TestnetAlert } from '@shared/components';

import { StableDividendsListFilter, StableDividendsStats, StableDividendsRewardInfo } from './components';
import styles from './stabledividends-list.page.module.scss';
import { useStableDividendsListPageViewModel } from './use-stabledividends-list.page.vm';

export const StableDividendsListPage: FC = observer(() => {
  const { title, data } = useStableDividendsListPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle data-test-id="stableDividendsPageTitle">{title}</PageTitle>
      <StableDividendsStats />
      <StableDividendsRewardInfo />
      <StableDividendsListFilter />
      <StateWrapper loaderFallback={<LoaderFallback />}>
        <Iterator
          render={ListItemCard}
          data={data}
          isGrouped
          wrapperClassName={styles.stableDividendsList}
          DTI="stabledividendsList"
        />
      </StateWrapper>
    </>
  );
});
