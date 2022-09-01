import { FC } from 'react';

import { Route } from 'react-router-dom';

import { PageNotFoundPage } from '@modules/errors';
import { SentryRoutes } from '@shared/services';

import { DexOneLiquidityRoutes } from './dex-one-liquidity-routes.enum';
import { DexOneAddLiq, DexOneRemoveLiq } from './pages';

export const DexOneLiquidityRouter: FC = () => (
  <SentryRoutes>
    <Route path={`${DexOneLiquidityRoutes.add}/:pairSlug`} element={<DexOneAddLiq />} />
    <Route path={`${DexOneLiquidityRoutes.remove}/:pairSlug`} element={<DexOneRemoveLiq />} />

    <Route path="*" element={<PageNotFoundPage />} />
  </SentryRoutes>
);
