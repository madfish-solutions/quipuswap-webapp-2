import { FC } from 'react';

import { Route } from 'react-router-dom';

import { StateWrapper } from '@shared/components';
import { SentryRoutes } from '@shared/services';

import { PageNotFoundPage } from '../errors';
import { LiquidityRoutes, NewLiquidityFormTabs } from './liquidity-routes.enum';
import { useLiquidityRouterViewModel } from './liquidity.routing.vm';
import { CpmmPageRouter, CreateNewPoolPage, NewLiquidityListPage, LiquidityPage } from './pages';

export const LiquidityPageRouter: FC = () => {
  const { isInitialized } = useLiquidityRouterViewModel();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<>Loading...</>}>
      <SentryRoutes>
        <Route path={LiquidityRoutes.root} element={<NewLiquidityListPage />} />

        <Route path={`/${NewLiquidityFormTabs.add}/*`} element={<LiquidityPage />} />
        <Route path={`/${NewLiquidityFormTabs.remove}/*`} element={<LiquidityPage />} />

        <Route path={`${LiquidityRoutes.cpmm}/*`} element={<CpmmPageRouter />} />

        <Route path={LiquidityRoutes.create} element={<CreateNewPoolPage />} />

        <Route path="*" element={<PageNotFoundPage />} />
      </SentryRoutes>
    </StateWrapper>
  );
};
