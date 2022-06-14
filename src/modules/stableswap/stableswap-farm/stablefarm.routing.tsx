import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { useLocation, Navigate, Routes, Route } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { PageNotFoundPage } from '@modules/errors';
import { StateWrapper } from '@shared/components';
import { getRouterParts, getLastElement, isSomeInArray, isUndefined } from '@shared/helpers';

import { Tabs } from '../stableswap-liquidity';
import { StableswapRoutes } from '../stableswap-routes.enum';
import { StableswapFarmListPage } from './pages/list';
import { useStableFarmRouterViewModel } from './stablefarm.routing.vm';

export const StableswapFarmRouter: FC = observer(() => {
  const { pathname } = useLocation();

  const { isInitialazied, error } = useStableFarmRouterViewModel();

  const routerParts = getRouterParts(pathname);
  const lastTab = getLastElement(routerParts);

  const isAddOrRemoveInUrl = isSomeInArray(routerParts, [Tabs.add, Tabs.remove]);

  if (!isUndefined(lastTab) && parseInt(lastTab) && !isAddOrRemoveInUrl) {
    return <Navigate replace to={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}/${Tabs.add}/${lastTab}`} />;
  }

  return (
    <StateWrapper isLoading={!isInitialazied} loaderFallback={<>Loading...</>} isError={!!error}>
      <Routes>
        <Route index element={<StableswapFarmListPage />} />

        <Route path="*" element={<PageNotFoundPage />} />
      </Routes>
    </StateWrapper>
  );
});
