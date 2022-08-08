import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Iterator, ListItemCard, PageTitle, StateWrapper, TestnetAlert } from '@shared/components';
import { NotFound } from '@shared/svg';

import { PoolCreation, StableswapLiquidityGeneralStats, StableswapLiquidityListFilter } from './components';
import styles from './stableswap-liquidity-list.page.module.scss';
import { useStableswapLiquidityPageViewModel } from './use-stableswap-liquidity-list.page.vm';

export const StableswapLiquidityListPage: FC = observer(() => {
  const { isLoading, title, list } = useStableswapLiquidityPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle data-test-id="SSLPageTitle">{title}</PageTitle>
      <StableswapLiquidityGeneralStats />
      <StableswapLiquidityListFilter />
      <StateWrapper isLoading={isLoading} loaderFallback={<NotFound />}>
        <Iterator
          render={ListItemCard}
          data={list}
          wrapperClassName={styles.list}
          isGrouped
          DTI="stableliquidityList"
        />
      </StateWrapper>
      <PoolCreation />
    </>
  );
});
