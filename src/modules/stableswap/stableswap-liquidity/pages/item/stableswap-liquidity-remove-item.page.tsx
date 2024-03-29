import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Iterator, Opportunity, PageTitle, StickyBlock, TestnetAlert } from '@shared/components';
import { isEmptyArray } from '@shared/helpers';

import { Details, RemoveLiqForm } from './components';
import styles from './stableswap-liquidity-item.module.scss';
import { useStableswapLiquidityRemoveItemPageViewModel } from './use-stableswap-liquidity-remove-item-page.vm';
import { StableswapFormTabsCard } from '../../../components';
import { StableswapRoutes } from '../../../stableswap-routes.enum';
import { StableswapLiquidityFormTabs } from '../../../types';

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
          {!isEmptyArray(opportunities) && (
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
