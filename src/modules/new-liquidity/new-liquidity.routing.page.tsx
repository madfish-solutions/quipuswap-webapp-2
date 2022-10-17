import { FC } from 'react';

import { Route } from 'react-router-dom';

import { DexOneAddLiq, DexOneRemoveLiq } from '@modules/new-liquidity/pages/dex-one-item';
import { StateWrapper } from '@shared/components';
import { SentryRoutes } from '@shared/services';

import { PageNotFoundPage } from '../errors';
import { NewLiquidityRoutes } from './new-liquidity-routes.enum';
import { useNewLiquidityViewModel } from './new-liquidity.routing.vm';
import { CreatePoolPage, PageContainerAdd, PageContainerRemove, NewLiquidityListPage } from './pages';
import { NewLiquidityCreatePage } from './pages/create';
import { NewLiquidityFormTabs } from './types';

export const NewLiquidityPageRouter: FC = () => {
  const { isInitialized } = useNewLiquidityViewModel();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<>Loading...</>}>
      <SentryRoutes>
        <Route path={NewLiquidityRoutes.root} element={<NewLiquidityListPage />} />

        <Route path={`${NewLiquidityRoutes.v1}/${NewLiquidityFormTabs.add}/:pairSlug`} element={<DexOneAddLiq />} />
        <Route
          path={`${NewLiquidityRoutes.v1}/${NewLiquidityFormTabs.remove}/:pairSlug`}
          element={<DexOneRemoveLiq />}
        />

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

        <Route path="*" element={<PageNotFoundPage />} />
      </SentryRoutes>
    </StateWrapper>
  );
};
