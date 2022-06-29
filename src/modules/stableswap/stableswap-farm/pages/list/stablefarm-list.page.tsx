import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Iterator, PageTitle, StateWrapper, TestnetAlert } from '@shared/components';

import { FarmCard, StableDividendsListFilter, FarmStats, StableswapLiquidityRewardInfo } from './components';
import styles from './stablefarm-list.page.module.scss';
import { useStableDividendsListPageViewModel } from './use-stablefarm-list.page.vm';

export const StableDividendsListPage: FC = observer(() => {
  const { title, data } = useStableDividendsListPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{title}</PageTitle>
      <FarmStats />
      <StableswapLiquidityRewardInfo />
      <StableDividendsListFilter />
      <StateWrapper loaderFallback={<></>}>
        <Iterator render={FarmCard} data={data} isGrouped wrapperClassName={styles.farmsList} />
      </StateWrapper>
    </>
  );
});
