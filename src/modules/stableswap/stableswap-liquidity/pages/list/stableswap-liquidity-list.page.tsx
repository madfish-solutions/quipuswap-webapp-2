import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Iterator, ListItemCard, PageTitle, StateWrapper, TestnetAlert } from '@shared/components';

import { StableswapLiquidityListFilter, StableswapLiquidityGeneralStats } from './components';
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
      <StateWrapper isLoading={isLoading} loaderFallback={<></>}>
        <Iterator render={ListItemCard} data={list} wrapperClassName={styles.list} isGrouped />
      </StateWrapper>
    </>
  );
});
