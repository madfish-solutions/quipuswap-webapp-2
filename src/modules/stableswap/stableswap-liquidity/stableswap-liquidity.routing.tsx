import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { Navigate, Route, useLocation } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { NOT_FOUND_LETTERS_ROUTE_NAME } from '@config/constants';
import { LoaderFallback, StateWrapper } from '@shared/components';
import { getLastElement, getRouterParts, isSomeInArray, isUndefined } from '@shared/helpers';
import { SentryRoutes } from '@shared/services';

import { PageNotFoundPage } from '../../errors';
import { StableswapRoutes } from '../stableswap-routes.enum';
import { StableswapLiquidityFormTabs } from '../types';
import {
  StableswapLiquidityAddItemPage,
  StableswapLiquidityCreatePage,
  StableswapLiquidityRemoveItemPage
} from './pages';
import { useStableswapLiquidityRouterViewModel } from './stableswap-liquidity.routing.vm';

export const StableswapLiquidityRouter: FC = observer(() => {
  const { pathname } = useLocation();
  const { isInitialazied, error } = useStableswapLiquidityRouterViewModel();

  const routerParts = getRouterParts(pathname);
  const lastRoutePart = getLastElement(routerParts);

  const isAddOrRemoveInUrl = isSomeInArray(routerParts, [
    StableswapLiquidityFormTabs.add,
    StableswapLiquidityFormTabs.remove
  ]);

  if (!isUndefined(lastRoutePart) && parseInt(lastRoutePart) && !isAddOrRemoveInUrl) {
    return (
      <Navigate
        replace
        to={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}/${NOT_FOUND_LETTERS_ROUTE_NAME}`}
      />
    );
  }

  return (
    <StateWrapper isLoading={!isInitialazied} loaderFallback={<LoaderFallback />} isError={!!error}>
      <SentryRoutes>
        <Route path={`/${StableswapLiquidityFormTabs.create}`} element={<StableswapLiquidityCreatePage />} />
        <Route
          path={`/${StableswapLiquidityFormTabs.add}/${NOT_FOUND_LETTERS_ROUTE_NAME}`}
          element={<PageNotFoundPage />}
        />
        <Route
          path={`/${StableswapLiquidityFormTabs.add}/:version/:poolId`}
          element={<StableswapLiquidityAddItemPage />}
        />
        <Route
          path={`/${StableswapLiquidityFormTabs.remove}/${NOT_FOUND_LETTERS_ROUTE_NAME}`}
          element={<PageNotFoundPage />}
        />
        <Route
          path={`/${StableswapLiquidityFormTabs.remove}/version/:poolId`}
          element={<StableswapLiquidityRemoveItemPage />}
        />

        <Route path="*" element={<PageNotFoundPage />} />
      </SentryRoutes>
    </StateWrapper>
  );
});
