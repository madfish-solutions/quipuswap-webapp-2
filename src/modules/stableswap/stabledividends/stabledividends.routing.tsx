import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { useLocation, Navigate, Route } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { NOT_FOUND_LETTERS_ROUTE_NAME } from '@config/constants';
import { PageNotFoundPage } from '@modules/errors';
import { LoaderFallback, StateWrapper } from '@shared/components';
import { getRouterParts, getLastElement, isSomeInArray, isUndefined } from '@shared/helpers';
import { SentryRoutes } from '@shared/services';

import { StableDividendsStakeItemPage, StableDividendsUnstakeItemPage, StableDividendsListPage } from './pages';
import { useStableDividendsRouterViewModel } from './stabledividends.routing.vm';
import { StableswapRoutes } from '../stableswap-routes.enum';
import { StableDividendsFormTabs } from '../types';

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
    <StateWrapper isLoading={!isInitialazied} loaderFallback={<LoaderFallback />} isError={!!error}>
      <SentryRoutes>
        <Route index element={<StableDividendsListPage />} />

        <Route
          path={`/${StableDividendsFormTabs.stake}/${NOT_FOUND_LETTERS_ROUTE_NAME}`}
          element={<PageNotFoundPage />}
        />
        <Route path={`/${StableDividendsFormTabs.stake}/:version/:poolId`} element={<StableDividendsStakeItemPage />} />
        <Route
          path={`/${StableDividendsFormTabs.unstake}/${NOT_FOUND_LETTERS_ROUTE_NAME}`}
          element={<PageNotFoundPage />}
        />
        <Route
          path={`/${StableDividendsFormTabs.unstake}/:version/:poolId`}
          element={<StableDividendsUnstakeItemPage />}
        />

        <Route path="*" element={<PageNotFoundPage />} />
      </SentryRoutes>
    </StateWrapper>
  );
});
