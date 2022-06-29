import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { useLocation, Navigate, Routes, Route } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { PageNotFoundPage } from '@modules/errors';
import { StateWrapper } from '@shared/components';
import { getRouterParts, getLastElement, isSomeInArray, isUndefined } from '@shared/helpers';

import { StableswapRoutes } from '../stableswap-routes.enum';
import { StableDividendsFormTabs } from '../types';
import { StableDividendsStakeItemPage, StableDividendsUnstakeItemPage, StableDividendsListPage } from './pages';
import { useStableDividendsRouterViewModel } from './stablefarm.routing.vm';

export const StableDividendsRouter: FC = observer(() => {
  const { pathname } = useLocation();

  const { isInitialazied, error } = useStableDividendsRouterViewModel();

  const routerParts = getRouterParts(pathname);
  const lastTab = getLastElement(routerParts);

  const isAddOrRemoveInUrl = isSomeInArray(routerParts, [
    StableDividendsFormTabs.stake,
    StableDividendsFormTabs.unstake
  ]);

  if (!isUndefined(lastTab) && parseInt(lastTab) && !isAddOrRemoveInUrl) {
    return (
      <Navigate
        replace
        to={`${AppRootRoutes.Stableswap}${StableswapRoutes.dividends}/${StableDividendsFormTabs.stake}/${lastTab}`}
      />
    );
  }

  return (
    <StateWrapper isLoading={!isInitialazied} loaderFallback={<>Loading...</>} isError={!!error}>
      <Routes>
        <Route index element={<StableDividendsListPage />} />

        <Route path={`/${StableDividendsFormTabs.stake}/:poolId`} element={<StableDividendsStakeItemPage />} />
        <Route path={`/${StableDividendsFormTabs.unstake}/:poolId`} element={<StableDividendsUnstakeItemPage />} />

        <Route path="*" element={<PageNotFoundPage />} />
      </Routes>
    </StateWrapper>
  );
});
