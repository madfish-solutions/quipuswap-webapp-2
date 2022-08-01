import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Iterator, ListItemCard, PageTitle, StateWrapper, TestnetAlert } from '@shared/components';
import { isDev } from '@shared/helpers';

import { PoolCreation, StableswapLiquidityGeneralStats, StableswapLiquidityListFilter } from './components';
import styles from './stableswap-liquidity-list.page.module.scss';
import { useStableswapLiquidityPageViewModel } from './use-stableswap-liquidity-list.page.vm';

export const StableswapLiquidityListPage: FC = observer(() => {
  const { isLoading, title, list } = useStableswapLiquidityPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{title}</PageTitle>
      <StableswapLiquidityGeneralStats />
      <StableswapLiquidityListFilter />
      <StateWrapper isLoading={isLoading} loaderFallback={<div>Error</div>}>
        <Iterator
          render={ListItemCard}
          data={list}
          wrapperClassName={styles.list}
          isGrouped
          DTI="stableliquidityList"
        />
      </StateWrapper>
      {isDev() ? <PoolCreation /> : null}
    </>
  );
});
