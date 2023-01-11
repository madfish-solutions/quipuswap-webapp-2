import { FC } from 'react';

import { Route } from 'react-router-dom';

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

      <Route path="*" element={<PageNotFoundPage />} />
    </SentryRoutes>
  );
};
