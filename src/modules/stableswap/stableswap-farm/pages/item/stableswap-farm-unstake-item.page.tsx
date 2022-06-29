import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, StickyBlock, TestnetAlert } from '@shared/components';

import { StableswapFormTabsCard } from '../../../components';
import { StableswapRoutes } from '../../../stableswap-routes.enum';
import { StableDividendsFormTabs } from '../../../types';
import { Details, StableDividendsRewardInfo, UnstakeForm } from '../../components';
import { useStableDividendsItemPageViewModel } from './use-stableswap-farm-item.page.vm';

export const StableDividendsUnstakeItemPage: FC = observer(() => {
  const { title } = useStableDividendsItemPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{title}</PageTitle>
      <StableDividendsRewardInfo />
      <StickyBlock>
        <StableswapFormTabsCard subpath={StableswapRoutes.dividends} tabActiveId={StableDividendsFormTabs.unstake}>
          <UnstakeForm />
        </StableswapFormTabsCard>
        <Details />
      </StickyBlock>
    </>
  );
});
