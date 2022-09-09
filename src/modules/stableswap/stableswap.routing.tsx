import { FC } from 'react';

import { Navigate, Route } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { SentryRoutes } from '@shared/services';

import { PageNotFoundPage } from '../errors';
import { StableDividendsRouter } from './stabledividends';
import { StableswapLiquidityRouter } from './stableswap-liquidity';
import { StableswapRoutes } from './stableswap-routes.enum';

export const StableswapRouter: FC = () => {
  return (
    <SentryRoutes>
      <Route path={`${StableswapRoutes.liquidity}/*`} element={<StableswapLiquidityRouter />} />
      <Route path={`${StableswapRoutes.dividends}/*`} element={<StableDividendsRouter />} />

      <Route
        path={StableswapRoutes.root}
        element={<Navigate replace to={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}`} />}
      />

      <Route path="*" element={<PageNotFoundPage />} />
    </SentryRoutes>
  );
};
