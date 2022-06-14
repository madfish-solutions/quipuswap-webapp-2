import { FC } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';

import { PageNotFoundPage } from '../errors';
import { StableswapFarmRouter } from './stableswap-farm';
import { StableswapLiquidityRouter } from './stableswap-liquidity';
import { StableswapRoutes } from './stableswap-routes.enum';

export const StableswapRouter: FC = () => {
  return (
    <Routes>
      <Route path={`${StableswapRoutes.liquidity}/*`} element={<StableswapLiquidityRouter />} />
      <Route path={`${StableswapRoutes.farming}/*`} element={<StableswapFarmRouter />} />

      <Route
        path={StableswapRoutes.root}
        element={<Navigate replace to={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}`} />}
      />

      <Route path="*" element={<PageNotFoundPage />} />
    </Routes>
  );
};
