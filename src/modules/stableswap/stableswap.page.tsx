import { FC } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { StateWrapper } from '@shared/components';

import { PageNotFoundPage } from '../errors';
import { StableswapLiquidityListPage, StableswapLiquidityItemPage } from './stableswap-liquidity';
import { useStableswapPageViewModel } from './stableswap.page.vm';

enum StableswapRoutes {
  root = '/',
  liquidity = '/liquidity/',
  liquidityItem = '/liquidity/:id'
}

export const StableswapPage: FC = () => {
  const { isInitialazied } = useStableswapPageViewModel();

  return (
    <StateWrapper isLoading={!isInitialazied} loaderFallback={<></>}>
      <Routes>
        <Route path={StableswapRoutes.liquidity} element={<StableswapLiquidityListPage />} />
        <Route path={StableswapRoutes.liquidityItem} element={<StableswapLiquidityItemPage />} />
        <Route
          path={StableswapRoutes.root}
          element={<Navigate replace to={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}`} />}
        />

        <Route path="*" element={<PageNotFoundPage />} />
      </Routes>
    </StateWrapper>
  );
};
