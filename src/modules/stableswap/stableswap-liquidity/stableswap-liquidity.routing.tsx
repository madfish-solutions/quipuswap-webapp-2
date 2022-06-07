import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { StateWrapper } from '@shared/components';
import { getLastElement, isUndefined } from '@shared/helpers';

import { PageNotFoundPage } from '../../errors';
import { checkForAddOrRemoveInUrlParts, getRouterParts } from '../helpers';
import { StableswapRoutes } from '../stableswap.routing';
import { StableswapLiquidityListPage } from './pages';
import { useStableswapLiquidityRouterViewModel } from './stableswap-liquidity.routing.vm';

export enum Tabs {
  add = 'add',
  remove = 'remove'
}

export const StableswapLiquidityRouter: FC = observer(() => {
  const { pathname } = useLocation();

  const { isInitialazied, error } = useStableswapLiquidityRouterViewModel();

  const routerParts = getRouterParts(pathname);
  const lastTab = getLastElement(routerParts);

  const isAddOrRemoveInUrl = checkForAddOrRemoveInUrlParts(routerParts);

  if (!isUndefined(lastTab) && parseInt(lastTab) && !isAddOrRemoveInUrl) {
    return <Navigate replace to={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}${Tabs.add}/${lastTab}`} />;
  }

  // eslint-disable-next-line no-console
  console.log('StableswapLiquidityListPage', StableswapLiquidityListPage);

  return (
    <StateWrapper
      isLoading={!isInitialazied}
      loaderFallback={<>Lading...</>}
      isError={!!error}
      errorFallback={<>Something went wrong: {error?.message}</>}
    >
      <Routes>
        {/*<Route path={`/${Tabs.add}/:poolId`} element={<StableswapLiquidityAddItemPage />} />*/}
        {/*<Route path={`/${Tabs.remove}/:poolId`} element={<StableswapLiquidityRemoveItemPage />} />*/}

        <Route path={'/'} element={<StableswapLiquidityListPage />} />

        <Route path="*" element={<PageNotFoundPage />} />
      </Routes>
    </StateWrapper>
  );
});
