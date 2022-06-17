import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Iterator, ListItemCard, PageTitle, StateWrapper, TestnetAlert } from '@shared/components';

import { ListFilter, StableswapLiquidityGeneralStats } from './components';
import { useStableswapLiquidityPageViewModel } from './use-stableswap-liquidity-list.page.vm';

export const StableswapLiquidityListPage: FC = observer(() => {
  const { isLoading, title, list } = useStableswapLiquidityPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{title}</PageTitle>
      <StableswapLiquidityGeneralStats />
      <ListFilter />
      <StateWrapper isLoading={isLoading} loaderFallback={<></>}>
        <Iterator render={ListItemCard} data={list} />
      </StateWrapper>
    </>
  );
});
