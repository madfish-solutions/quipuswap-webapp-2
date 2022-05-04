import { FC } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { StateWrapper } from '@shared/components';

import { PageNotFoundPage } from '../errors';
import { StableswapLiquidityPage } from './stableswap-liquidity';
import { useStableswapPageViewModel } from './stableswap.page.vm';

enum StableswapRoutes {
  root = '/',
  liquidity = '/liquidity'
}

export const StableswapPage: FC = () => {
  const { isInitialazied } = useStableswapPageViewModel();
  // eslint-disable-next-line no-console
  console.log(isInitialazied);

  return (
    <StateWrapper isLoading={!isInitialazied} loaderFallback={<></>}>
      <Routes>
        <Route path={StableswapRoutes.liquidity} element={<StableswapLiquidityPage />} />
        <Route
          path={StableswapRoutes.root}
          element={<Navigate replace to={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}`} />}
        />

        <Route path="*" element={<PageNotFoundPage />} />
      </Routes>
    </StateWrapper>
  );
};
