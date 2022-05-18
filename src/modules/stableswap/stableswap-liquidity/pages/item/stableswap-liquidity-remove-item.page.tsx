import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, StickyBlock, TestnetAlert } from '@shared/components';

import { StableswapFormTabs } from '../../../types';
import { Details, StableswapFormTabsCard } from './components';
import { RemoveLiqForm } from './components/forms';
import { useStableswapLiquidityRemoveItemPageViewModel } from './use-stableswap-liquidity-remove-item-page.vm';

export const StableswapLiquidityRemoveItemPage: FC = observer(() => {
  const { title } = useStableswapLiquidityRemoveItemPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{title}</PageTitle>
      <StickyBlock>
        <StableswapFormTabsCard tabActiveId={StableswapFormTabs.remove}>
          <RemoveLiqForm />
        </StableswapFormTabsCard>
        <Details />
      </StickyBlock>
    </>
  );
});
