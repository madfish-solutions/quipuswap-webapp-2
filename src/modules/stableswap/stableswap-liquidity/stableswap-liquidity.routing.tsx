import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { Navigate, Route, useLocation } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { LoaderFallback, StateWrapper } from '@shared/components';
import { getLastElement, getRouterParts, isSomeInArray, isUndefined } from '@shared/helpers';
import { SentryRoutes } from '@shared/services';

import { PageNotFoundPage } from '../../errors';
import { StableswapRoutes } from '../stableswap-routes.enum';
import { StableswapLiquidityFormTabs } from '../types';
import {
  StableswapLiquidityAddItemPage,
  StableswapLiquidityCreatePage,
  StableswapLiquidityListPage,
  StableswapLiquidityRemoveItemPage
} from './pages';
import { useStableswapLiquidityRouterViewModel } from './stableswap-liquidity.routing.vm';

export const StableswapLiquidityRouter: FC = observer(() => {
  const { pathname } = useLocation();
  const { isInitialazied, error } = useStableswapLiquidityRouterViewModel();

  const routerParts = getRouterParts(pathname);
  const lastTab = getLastElement(routerParts);

  const isAddOrRemoveInUrl = isSomeInArray(routerParts, [
    StableswapLiquidityFormTabs.add,
    StableswapLiquidityFormTabs.remove
  ]);

  if (!isUndefined(lastTab) && parseInt(lastTab) && !isAddOrRemoveInUrl) {
    return (
      <Navigate
        replace
        to={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}/${StableswapLiquidityFormTabs.add}/${lastTab}`}
      />
    );
  }

  return (
    <StateWrapper isLoading={!isInitialazied} loaderFallback={<LoaderFallback />} isError={!!error}>
      <SentryRoutes>
        <Route path={`/${StableswapLiquidityFormTabs.create}`} element={<StableswapLiquidityCreatePage />} />
        <Route path={`/${StableswapLiquidityFormTabs.add}/:poolId`} element={<StableswapLiquidityAddItemPage />} />
        <Route
          path={`/${StableswapLiquidityFormTabs.remove}/:poolId`}
          element={<StableswapLiquidityRemoveItemPage />}
        />

        <Route path={'/'} element={<StableswapLiquidityListPage />} />

        <Route path="*" element={<PageNotFoundPage />} />
      </SentryRoutes>
    </StateWrapper>
  );
});
