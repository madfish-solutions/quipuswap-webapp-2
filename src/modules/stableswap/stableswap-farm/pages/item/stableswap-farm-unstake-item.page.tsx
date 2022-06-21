import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, StickyBlock, TestnetAlert } from '@shared/components';

import { StableswapFormTabsCard } from '../../../components';
import { StableswapRoutes } from '../../../stableswap-routes.enum';
import { StableFarmFormTabs } from '../../../types';
import { Details, StableFarmRewardInfo, UnstakeForm } from '../../components';
import { useStableswapFarmItemPageViewModel } from './use-stableswap-farm-item.page.vm';

export const StableswapFarmUnstakeItemPage: FC = observer(() => {
  const { title } = useStableswapFarmItemPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{title}</PageTitle>
      <StableFarmRewardInfo />
      <StickyBlock>
        <StableswapFormTabsCard subpath={StableswapRoutes.farming} tabActiveId={StableFarmFormTabs.unstake}>
          <UnstakeForm />
        </StableswapFormTabsCard>
        <Details />
      </StickyBlock>
    </>
  );
});
