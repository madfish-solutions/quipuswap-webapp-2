import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, StickyBlock, TestnetAlert } from '@shared/components';

import { StableswapFormTabsCard } from '../../../components';
import { StableswapRoutes } from '../../../stableswap-routes.enum';
import { StableswapLiquidityFormTabs } from '../../../types';
import { Details } from './components';
import { AddLiqForm } from './components/forms';
import { useStableswapLiquiditAddItemPageViewModel } from './use-stableswap-liquidity-add-item-page.vm';

export const StableswapLiquidityAddItemPage: FC = observer(() => {
  const { title } = useStableswapLiquiditAddItemPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{title}</PageTitle>
      <StickyBlock>
        <StableswapFormTabsCard subpath={StableswapRoutes.liquidity} tabActiveId={StableswapLiquidityFormTabs.add}>
          <AddLiqForm />
        </StableswapFormTabsCard>
        <Details />
      </StickyBlock>
    </>
  );
});
