import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { StateWrapper } from '@shared/components';
import { isUndefined } from '@shared/helpers';

import { PageNotFoundPage } from '../errors';
import { StableswapLiquidityListPage, StableswapLiquidityItemPage } from './stableswap-liquidity/pages';
import { useStableswapPageViewModel } from './stableswap.page.vm';
import { StableswapFormTabs } from './types';

const ONE = 1;

export enum StableswapRoutes {
  root = '/',
  liquidity = '/liquidity/',
  liquidityTabPoolId = '/liquidity/:tab/:poolId'
}

export const StableswapPage: FC = observer(() => {
  const location = useLocation();

  const { isInitialazied } = useStableswapPageViewModel();

  const locationParts = location.pathname.split('/').filter(part => part);
  const tab = locationParts[locationParts.length - ONE];
  const isAddOrRemoveInUrl = locationParts.some(
    part => part === StableswapFormTabs.add || part === StableswapFormTabs.remove
  );

  if (!isUndefined(tab) && parseInt(tab) && !isAddOrRemoveInUrl) {
    return (
      <Navigate
        replace
        to={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}${StableswapFormTabs.add}/${tab}`}
      />
    );
  } else if (tab === StableswapFormTabs.add || tab === StableswapFormTabs.remove) {
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
});
