import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, StickyBlock, TestnetAlert } from '@shared/components';

import { useStableDividendsItemPageViewModel } from './use-stabledividends-item.page.vm';
import { StableswapFormTabsCard } from '../../../components';
import { StableswapRoutes } from '../../../stableswap-routes.enum';
import { StableDividendsFormTabs } from '../../../types';
import { Details, StableDividendsRewardInfo, UnstakeForm } from '../../components';

export const StableDividendsUnstakeItemPage: FC = observer(() => {
  const { title } = useStableDividendsItemPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle data-test-id="stableDividendsUnstakePageTitle">{title}</PageTitle>
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
