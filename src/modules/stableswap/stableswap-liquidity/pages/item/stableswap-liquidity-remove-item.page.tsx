import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, StickyBlock, TestnetAlert } from '@shared/components';

import { StableswapFormTabsCard } from '../../../components';
import { StableswapRoutes } from '../../../stableswap-routes.enum';
import { StableswapLiquidityFormTabs } from '../../../types';
import { Details } from './components';
import { RemoveLiqForm } from './components/forms';
import { useStableswapLiquidityRemoveItemPageViewModel } from './use-stableswap-liquidity-remove-item-page.vm';

export const StableswapLiquidityRemoveItemPage: FC = observer(() => {
  const { title } = useStableswapLiquidityRemoveItemPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{title}</PageTitle>
      <StickyBlock>
        <StableswapFormTabsCard subpath={StableswapRoutes.liquidity} tabActiveId={StableswapLiquidityFormTabs.remove}>
          <RemoveLiqForm />
        </StableswapFormTabsCard>
        <Details />
      </StickyBlock>
    </>
  );
});
