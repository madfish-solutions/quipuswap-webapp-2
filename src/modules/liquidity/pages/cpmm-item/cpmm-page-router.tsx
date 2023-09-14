import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { Route } from 'react-router-dom';

import { NOT_FOUND_ROUTE_NAME } from '@config/constants';
import { PageNotFoundPage } from '@modules/errors';
import { LoaderFallback, StateWrapper } from '@shared/components';
import { SentryRoutes } from '@shared/services';

// import { CpmmDexTwoClaimRewards } from './cpmm-dex-two-claim-rewards';
import { DexTwoAddLiq } from './dex-two-add-liq';
import { DexTwoRemoveLiq } from './dex-two-remove-liq';
import { useCpmmViewModel } from './use-dex-two-item-page.vm';
import { LiquidityTabs } from '../../liquidity-routes.enum';
import { LiquidityCreatePage } from '../create';

export const CpmmPageRouter: FC = observer(() => {
  const { isInitialized } = useCpmmViewModel();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<LoaderFallback />}>
      <SentryRoutes>
        <Route path={`${LiquidityTabs.add}/${NOT_FOUND_ROUTE_NAME}`} element={<PageNotFoundPage />} />
        <Route path={`${LiquidityTabs.add}/:pairSlug`} element={<DexTwoAddLiq />} />
        <Route path={`${LiquidityTabs.remove}/${NOT_FOUND_ROUTE_NAME}`} element={<PageNotFoundPage />} />
        <Route path={`${LiquidityTabs.remove}/:pairSlug`} element={<DexTwoRemoveLiq />} />
        {/* <Route path={`${LiquidityTabs.claim}/${NOT_FOUND_ROUTE_NAME}`} element={<PageNotFoundPage />} />
        <Route path={`${LiquidityTabs.claim}/:pairSlug`} element={<CpmmDexTwoClaimRewards title={title} />} /> */}
        <Route path={`${LiquidityTabs.create}`} element={<LiquidityCreatePage />} />
        <Route path="*" element={<PageNotFoundPage />} />
      </SentryRoutes>
    </StateWrapper>
  );
});
