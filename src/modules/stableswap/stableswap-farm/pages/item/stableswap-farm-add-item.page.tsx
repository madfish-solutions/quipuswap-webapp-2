import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, StickyBlock, TestnetAlert } from '@shared/components';

import { StableswapFormTabsCard } from '../../../components';
import { StableswapRoutes } from '../../../stableswap-routes.enum';
import { StableFarmFormTabs } from '../../../types';
import { Details, StakeForm } from '../../components';
import { useStableswapFarmAddItemPageViewModel } from './use-stableswap-farm-add-item.page.vm';

export const StableswapFarmAddItemPage: FC = observer(() => {
  const { title } = useStableswapFarmAddItemPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{title}</PageTitle>
      <StickyBlock>
        <StableswapFormTabsCard subpath={StableswapRoutes.farming} tabActiveId={StableFarmFormTabs.stake}>
          <StakeForm />
        </StableswapFormTabsCard>
        <Details />
      </StickyBlock>
    </>
  );
});
