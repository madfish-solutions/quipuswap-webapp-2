import { FC } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import { AppRootRoutes } from '../../router';
import { PageNotFoundPage } from '../errors';
import { StableswapLiquidityPage } from './stableswap-liquidity';

enum StableswapRoutes {
  root = '/',
  liquidity = '/liquidity'
}

export const StableswapPage: FC = () => (
  <Routes>
    <Route path={StableswapRoutes.liquidity} element={<StableswapLiquidityPage />} />
    <Route
      path={StableswapRoutes.root}
      element={<Navigate replace to={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}`} />}
    />

    <Route path="*" element={<PageNotFoundPage />} />
  </Routes>
);
