import { FC } from 'react';

import { Route } from 'react-router-dom';

import { StateWrapper } from '@shared/components';
import { SentryRoutes } from '@shared/services';

import { PageNotFoundPage } from '../errors';
import { NewLiquidityRoutes, TabsLiquidityRoutes } from './new-liquidity-routes.enum';
import { useNewLiquidityViewModel } from './new-liquidity.routing.vm';
import { CpmmPageRouter, CreateNewPoolPage, NewLiquidityListPage, LiquidityPage } from './pages';

export const NewLiquidityPageRouter: FC = () => {
  const { isInitialized } = useNewLiquidityViewModel();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<>Loading...</>}>
      <SentryRoutes>
        <Route path={NewLiquidityRoutes.root} element={<NewLiquidityListPage />} />

        <Route path={`${TabsLiquidityRoutes.add}/*`} element={<LiquidityPage />} />
        <Route path={`${TabsLiquidityRoutes.remove}/*`} element={<LiquidityPage />} />

        <Route path={`${NewLiquidityRoutes.cpmm}/*`} element={<CpmmPageRouter />} />

        <Route path={NewLiquidityRoutes.create} element={<CreateNewPoolPage />} />

        <Route path="*" element={<PageNotFoundPage />} />
      </SentryRoutes>
    </StateWrapper>
  );
};
