import { FC } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { StateWrapper } from '@shared/components';

import { PageNotFoundPage } from '../errors';
import { StableswapLiquidityRouter } from './stableswap-liquidity';

export enum StableswapRoutes {
  root = '/',
  liquidity = '/liquidity',
  farming = '/farming'
}

export const StableswapRouter: FC = () => {
  return (
    <StateWrapper isLoading={false} loaderFallback={<div>loading...</div>}>
      <Routes>
        <Route path={`${StableswapRoutes.liquidity}/*`} element={<StableswapLiquidityRouter />} />
        <Route path={`${StableswapRoutes.farming}/*`} element={<h1>Farming</h1>} />

        <Route
          path={StableswapRoutes.root}
          element={<Navigate replace to={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}`} />}
        />

        <Route path="*" element={<PageNotFoundPage />} />
      </Routes>
    </StateWrapper>
  );
};
