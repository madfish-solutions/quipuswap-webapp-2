import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, StickyBlock, TestnetAlert, Opportunity, Iterator } from '@shared/components';
import { isStableswapOpportunitiesReleased } from '@shared/feature-flags';

import { StableswapFormTabsCard } from '../../../components';
import { StableswapRoutes } from '../../../stableswap-routes.enum';
import { StableswapLiquidityFormTabs } from '../../../types';
import { Details } from './components';
import { AddLiqForm } from './components/forms';
import styles from './stableswap-liquidity-item.module.scss';
import { useStableswapLiquiditAddItemPageViewModel } from './use-stableswap-liquidity-add-item-page.vm';

export const StableswapLiquidityAddItemPage: FC = observer(() => {
  const { title, opportunities } = useStableswapLiquiditAddItemPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle data-test-id="SSLItemPageTitleAdd">{title}</PageTitle>
      <StickyBlock>
        <StableswapFormTabsCard subpath={StableswapRoutes.liquidity} tabActiveId={StableswapLiquidityFormTabs.add}>
          <AddLiqForm />
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
