import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Iterator, PageTitle, StateWrapper, TestnetAlert } from '@shared/components';

import { StableswapLiquidityListFilter, PoolCard, StableswapLiquidityGeneralStats } from './components';
import styles from './stableswap-liquidity-list.page.module.scss';
import { useStableswapLiquidityPageViewModel } from './use-stableswap-liquidity-list.page.vm';

export const StableswapLiquidityListPage: FC = observer(() => {
  const { isLoading, list, title } = useStableswapLiquidityPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{title}</PageTitle>
      <StableswapLiquidityGeneralStats />
      <StableswapLiquidityListFilter />
      <StateWrapper isLoading={isLoading} loaderFallback={<></>}>
        <Iterator render={PoolCard} data={list} isGrouped wrapperClassName={styles.poolsList} />
      </StateWrapper>
    </>
  );
});
