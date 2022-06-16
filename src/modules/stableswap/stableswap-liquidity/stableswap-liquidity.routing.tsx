import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { StateWrapper } from '@shared/components';
import { getLastElement, getRouterParts, isSomeInArray, isUndefined } from '@shared/helpers';

import { PageNotFoundPage } from '../../errors';
import { StableswapRoutes } from '../stableswap-routes.enum';
import { StableswapFormTabs } from '../types';
import {
  StableswapLiquidityAddItemPage,
  StableswapLiquidityListPage,
  StableswapLiquidityRemoveItemPage
} from './pages';
import { useStableswapLiquidityRouterViewModel } from './stableswap-liquidity.routing.vm';

export const StableswapLiquidityRouter: FC = observer(() => {
  const { pathname } = useLocation();

  const { isInitialazied, error } = useStableswapLiquidityRouterViewModel();

  const routerParts = getRouterParts(pathname);
  const lastTab = getLastElement(routerParts);

  const isAddOrRemoveInUrl = isSomeInArray(routerParts, [StableswapFormTabs.add, StableswapFormTabs.remove]);

  if (!isUndefined(lastTab) && parseInt(lastTab) && !isAddOrRemoveInUrl) {
    return (
      <Navigate
        replace
        to={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}/${StableswapFormTabs.add}/${lastTab}`}
      />
    );
  }

  return (
    <StateWrapper isLoading={!isInitialazied} loaderFallback={<>Loading...</>} isError={!!error}>
      <Routes>
        <Route path={`/${StableswapFormTabs.add}/:poolId`} element={<StableswapLiquidityAddItemPage />} />
        <Route path={`/${StableswapFormTabs.remove}/:poolId`} element={<StableswapLiquidityRemoveItemPage />} />

        <Route path={'/'} element={<StableswapLiquidityListPage />} />

        <Route path="*" element={<PageNotFoundPage />} />
      </Routes>
    </StateWrapper>
  );
});
