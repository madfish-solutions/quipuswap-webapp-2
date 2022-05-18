import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, StickyBlock, TestnetAlert } from '@shared/components';

import { Details, StableswapFormTabsCard } from './components';
import { AddLiqForm } from './components/forms';
import { useStableswapLiquiditAddItemPageViewModel } from './use-stableswap-liquidity-add-item-page.vm';

export const StableswapLiquidityAddItemPage: FC = observer(() => {
  const { title, tabActiveId } = useStableswapLiquiditAddItemPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{title}</PageTitle>
      <StickyBlock>
        <StableswapFormTabsCard tabActiveId={tabActiveId}>
          <AddLiqForm />
        </StableswapFormTabsCard>
        <Details />
      </StickyBlock>
    </>
  );
});
