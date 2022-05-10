import { FC } from 'react';

import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { StateWrapper } from '@shared/components';
import { isUndefined } from '@shared/helpers';

import { PageNotFoundPage } from '../errors';
import { getLastRouterTabsAndCheckForAddOrRemove } from './helpers';
import { StableswapLiquidityListPage, StableswapLiquidityItemPage } from './stableswap-liquidity/pages';
import { useStableswapPageViewModel } from './stableswap.page.vm';

export enum Tabs {
  add = 'add',
  remove = 'remove'
}

enum StableswapRoutes {
  root = '/',
  liquidity = '/liquidity/',
  liquidityTabPoolId = '/liquidity/:tab/:poolId'
}

export const StableswapPage: FC = () => {
  const { pathname } = useLocation();

  const { isInitialazied } = useStableswapPageViewModel();

  const { lastTab, isAddOrRemoveInUrl, isLastTabAddOrRemove } = getLastRouterTabsAndCheckForAddOrRemove(pathname);

  if (!isUndefined(lastTab) && parseInt(lastTab) && !isAddOrRemoveInUrl) {
    return <Navigate replace to={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}${Tabs.add}/${lastTab}`} />;
  } else if (isLastTabAddOrRemove) {
    return <Navigate replace to={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}`} />;
  }

  return (
    <StateWrapper isLoading={!isInitialazied} loaderFallback={<></>}>
      <Routes>
        <Route
          path={StableswapRoutes.root}
          element={<Navigate replace to={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}`} />}
        />

        <Route path={StableswapRoutes.liquidity} element={<StableswapLiquidityListPage />} />

        <Route path={StableswapRoutes.liquidityTabPoolId} element={<StableswapLiquidityItemPage />} />

        <Route path="*" element={<PageNotFoundPage />} />
      </Routes>
    </StateWrapper>
  );
};
