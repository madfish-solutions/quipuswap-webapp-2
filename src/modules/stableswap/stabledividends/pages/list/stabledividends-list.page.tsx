import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Iterator, ListItemCard, PageTitle, StateWrapper, TestnetAlert } from '@shared/components';

import { StableDividendsListFilter, StableDividendsStats, StableDividendsRewardInfo } from './components';
import styles from './stabledividends-list.page.module.scss';
import { useStableDividendsListPageViewModel } from './use-stabledividends-list.page.vm';

export const StableDividendsListPage: FC = observer(() => {
  const { title, data } = useStableDividendsListPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{title}</PageTitle>
      <StableDividendsStats />
      <StableDividendsRewardInfo />
      <StableDividendsListFilter />
      <StateWrapper loaderFallback={<></>}>
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
