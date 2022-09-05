import { FC } from 'react';

import { Route } from 'react-router-dom';

import { StateWrapper } from '@shared/components';
import { SentryRoutes } from '@shared/services';

import { PageNotFoundPage } from '../errors';
import { NewLiquidityRoutes } from './new-liquidity-routes.enum';
import { useNewLiquidityViewModel } from './new-liquidity.routing.vm';
import { DexOneAddLiq, DexOneRemoveLiq } from './pages/dex-one-item';
import { DexTwoAddLiq, DexTwoRemoveLiq } from './pages/item';
import { NewLiquidityListPage } from './pages/list';
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

        <Route path={`${NewLiquidityRoutes.cpmm}/${NewLiquidityFormTabs.add}/:pairSlug`} element={<DexTwoAddLiq />} />
        <Route
          path={`${NewLiquidityRoutes.cpmm}/${NewLiquidityFormTabs.remove}/:pairSlug`}
          element={<DexTwoRemoveLiq />}
        />

        <Route path="*" element={<PageNotFoundPage />} />
      </SentryRoutes>
    </StateWrapper>
  );
};
