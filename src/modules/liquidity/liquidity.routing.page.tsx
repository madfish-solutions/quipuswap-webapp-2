import { FC } from 'react';

import { Route } from 'react-router-dom';

import { NOT_FOUND_ROUTE_NAME } from '@config/constants';
import { LoaderFallback, StateWrapper } from '@shared/components';
import { SentryRoutes } from '@shared/services';

import { PageNotFoundPage } from '../errors';
import { LiquidityRoutes, LiquidityTabs } from './liquidity-routes.enum';
import { useLiquidityRouterViewModel } from './liquidity.routing.vm';
import { CpmmPageRouter, CreatePoolPage, LiquidityListPage, LiquidityPage } from './pages';
import { V3ItemPageRouter } from './pages/v3-item-page';

export const LiquidityPageRouter: FC = () => {
  const { isInitialized } = useLiquidityRouterViewModel();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<LoaderFallback />}>
      <SentryRoutes>
        <Route path={LiquidityRoutes.root} element={<LiquidityListPage />} />

        <Route path={`/${LiquidityTabs.add}/${NOT_FOUND_ROUTE_NAME}`} element={<PageNotFoundPage />} />
        <Route path={`/${LiquidityTabs.add}/*`} element={<LiquidityPage />} />
        <Route path={`/${LiquidityTabs.remove}/${NOT_FOUND_ROUTE_NAME}`} element={<PageNotFoundPage />} />
        <Route path={`/${LiquidityTabs.remove}/*`} element={<LiquidityPage />} />

        <Route path={`${LiquidityRoutes.cpmm}/*`} element={<CpmmPageRouter />} />
        <Route path={`${LiquidityRoutes.v3}/*`} element={<V3ItemPageRouter />} />

        <Route path={LiquidityRoutes.create} element={<CreatePoolPage />} />

        <Route path="*" element={<PageNotFoundPage />} />
      </SentryRoutes>
    </StateWrapper>
  );
};
