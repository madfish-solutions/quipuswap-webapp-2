import { FC } from 'react';

import { Route } from 'react-router-dom';

import { StateWrapper } from '@shared/components';
import { SentryRoutes } from '@shared/services';

import { PageNotFoundPage } from '../errors';
import { LiquidityPage } from '../liquidity';
import { NewLiquidityRoutes, TabsLiquidityRoutes } from './new-liquidity-routes.enum';
import { useNewLiquidityViewModel } from './new-liquidity.routing.vm';
import { CreatePoolPage, PageContainerAdd, PageContainerRemove, NewLiquidityListPage, CpmmPageRouter } from './pages';
import { NewLiquidityCreatePage } from './pages/create';
import { NewLiquidityFormTabs } from './types';

export const NewLiquidityPageRouter: FC = () => {
  const { isInitialized } = useNewLiquidityViewModel();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<>Loading...</>}>
      <SentryRoutes>
        <Route path={NewLiquidityRoutes.root} element={<NewLiquidityListPage />} />

        <Route
          path={`${NewLiquidityRoutes.cpmm}/${NewLiquidityFormTabs.add}/:pairSlug`}
          element={<PageContainerAdd />}
        />
        <Route
          path={`${NewLiquidityRoutes.cpmm}/${NewLiquidityFormTabs.remove}/:pairSlug`}
          element={<PageContainerRemove />}
        />
        <Route path={NewLiquidityRoutes.create} element={<CreatePoolPage />} />

        <Route
          path={`${NewLiquidityRoutes.cpmm}/${NewLiquidityFormTabs.create}`}
          element={<NewLiquidityCreatePage />}
        />

        <Route path={`${NewLiquidityRoutes.cpmm}/*`} element={<CpmmPageRouter />} />

        <Route path={`${TabsLiquidityRoutes.add}/*`} element={<LiquidityPage />} />
        <Route path={`${TabsLiquidityRoutes.remove}/*`} element={<LiquidityPage />} />

        <Route path="*" element={<PageNotFoundPage />} />
      </SentryRoutes>
    </StateWrapper>
  );
};
