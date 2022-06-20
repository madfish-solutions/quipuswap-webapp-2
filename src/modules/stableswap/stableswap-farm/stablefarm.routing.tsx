import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { useLocation, Navigate, Routes, Route } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { PageNotFoundPage } from '@modules/errors';
import { StateWrapper } from '@shared/components';
import { getRouterParts, getLastElement, isSomeInArray, isUndefined } from '@shared/helpers';

import { StableswapRoutes } from '../stableswap-routes.enum';
import { StableFarmFormTabs } from '../types';
import { StableswapFarmListPage } from './pages';
import { StableswapFarmAddItemPage } from './pages/item/stableswap-farm-add-item.page';
import { useStableFarmRouterViewModel } from './stablefarm.routing.vm';

export const StableswapFarmRouter: FC = observer(() => {
  const { pathname } = useLocation();

  const { isInitialazied, error } = useStableFarmRouterViewModel();

  const routerParts = getRouterParts(pathname);
  const lastTab = getLastElement(routerParts);

  const isAddOrRemoveInUrl = isSomeInArray(routerParts, [StableFarmFormTabs.stake, StableFarmFormTabs.unstake]);

  if (!isUndefined(lastTab) && parseInt(lastTab) && !isAddOrRemoveInUrl) {
    return (
      <Navigate
        replace
        to={`${AppRootRoutes.Stableswap}${StableswapRoutes.farming}/${StableFarmFormTabs.stake}/${lastTab}`}
      />
    );
  }

  return (
    <StateWrapper isLoading={!isInitialazied} loaderFallback={<>Loading...</>} isError={!!error}>
      <Routes>
        <Route index element={<StableswapFarmListPage />} />

        <Route path={`/${StableFarmFormTabs.stake}/:poolId`} element={<StableswapFarmAddItemPage />} />
        {/* <Route path={`/${Tabs.unstake}/:poolId`} element={<StableswapLiquidityRemoveItemPage />} /> */}

        <Route path="*" element={<PageNotFoundPage />} />
      </Routes>
    </StateWrapper>
  );
});
