import { FC } from 'react';

import { Route } from 'react-router-dom';

import { SentryRoutes } from '@shared/services';

import { StableDividendsRouter } from './stabledividends';
import { StableswapLiquidityRouter } from './stableswap-liquidity';
import { StableswapRoutes } from './stableswap-routes.enum';
import { PageNotFoundPage } from '../errors';

export const StableswapRouter: FC = () => {
  return (
    <SentryRoutes>
      <Route path={`${StableswapRoutes.liquidity}/*`} element={<StableswapLiquidityRouter />} />
      <Route path={`${StableswapRoutes.dividends}/*`} element={<StableDividendsRouter />} />

      <Route path="*" element={<PageNotFoundPage />} />
    </SentryRoutes>
  );
};
