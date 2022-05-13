import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, StickyBlock, TestnetAlert } from '@shared/components';

import { Details, StableswapFormTabsCard } from './components';
import { useStableswapLiquidityItemPageViewModel } from './use-stableswap-liquidity-item-page.vm';

export const StableswapLiquidityItemPage: FC = observer(() => {
  const { title } = useStableswapLiquidityItemPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{title}</PageTitle>
      <StickyBlock>
        <StableswapFormTabsCard />
        <Details />
      </StickyBlock>
      <Details />
    </>
  );
});
