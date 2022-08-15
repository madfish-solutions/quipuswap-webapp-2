import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Iterator, Opportunity, PageTitle, StickyBlock, TestnetAlert } from '@shared/components';
import { isStableswapOpportunitiesReleased } from '@shared/feature-flags';

import { StableswapFormTabsCard } from '../../../components';
import { StableswapRoutes } from '../../../stableswap-routes.enum';
import { StableswapLiquidityFormTabs } from '../../../types';
import { Details } from './components';
import { RemoveLiqForm } from './components/forms';
import styles from './stableswap-liquidity-item.module.scss';
import { useStableswapLiquidityRemoveItemPageViewModel } from './use-stableswap-liquidity-remove-item-page.vm';

export const StableswapLiquidityRemoveItemPage: FC = observer(() => {
  const { title, opportunities } = useStableswapLiquidityRemoveItemPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle data-test-id="SSLItemPageTitleRemove">{title}</PageTitle>
      <StickyBlock>
        <StableswapFormTabsCard subpath={StableswapRoutes.liquidity} tabActiveId={StableswapLiquidityFormTabs.remove}>
          <RemoveLiqForm />
        </StableswapFormTabsCard>
        <div>
          {isStableswapOpportunitiesReleased && (
            <Iterator
              render={Opportunity}
              data={opportunities}
              wrapperClassName={styles.opportunitiesWrapper}
              isGrouped
            />
          )}
          <Details />
        </div>
      </StickyBlock>
    </>
  );
});
