import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { StateWrapper } from '@shared/components';
import { getLastElement, isUndefined } from '@shared/helpers';

import { PageNotFoundPage } from '../errors';
import { checkForAddOrRemoveInUrlParts, getRouterParts } from './helpers';
import { StableswapLiquidityListPage, StableswapLiquidityItemPage } from './stableswap-liquidity/pages';
import { useStableswapPageViewModel } from './stableswap.page.vm';

export enum Tabs {
  add = 'add',
  remove = 'remove'
}

export enum StableswapRoutes {
  root = '/',
  liquidity = '/liquidity/'
}

export const StableswapPage: FC = observer(() => {
  const { pathname } = useLocation();

  const { isInitialazied } = useStableswapPageViewModel();

  const routerParts = getRouterParts(pathname);
  const lastTab = getLastElement(routerParts);

  const isAddOrRemoveInUrl = checkForAddOrRemoveInUrlParts(routerParts);

  if (!isUndefined(lastTab) && parseInt(lastTab) && !isAddOrRemoveInUrl) {
    return <Navigate replace to={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}${Tabs.add}/${lastTab}`} />;
  }

  return (
    <StateWrapper isLoading={!isInitialazied} loaderFallback={<></>}>
      <Routes>
        <Route
          path={StableswapRoutes.root}
          element={<Navigate replace to={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}`} />}
        />

        <Route path={StableswapRoutes.liquidity} element={<StableswapLiquidityListPage />} />

        <Route path={`${StableswapRoutes.liquidity}${Tabs.add}/:poolId`} element={<StableswapLiquidityItemPage />} />
        <Route path={`${StableswapRoutes.liquidity}${Tabs.remove}/:poolId`} element={<StableswapLiquidityItemPage />} />

        <Route path="*" element={<PageNotFoundPage />} />
      </Routes>
    </StateWrapper>
  );
});
