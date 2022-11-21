import { FC } from 'react';

import { Route } from 'react-router-dom';

import { ErrorFallback, StateWrapper } from '@shared/components';
import { SentryRoutes } from '@shared/services';

import { useFarmingRouterViewModel } from './farming-router.vm';
import { FarmingItemPage } from './pages/item';
import { FarmsListPage } from './pages/list';
import { YouvesItemPage } from './pages/youves-item';

export enum FarmingRoutes {
  VersionOne = 'v1',
  VersionTwo = 'v2',
  VersionThree = 'v3'
}

export const FarmingRouter: FC = () => {
  const { isInitialized, error } = useFarmingRouterViewModel();

  return (
    <StateWrapper
      isLoading={!isInitialized}
      loaderFallback={<div>Loading...</div>}
      isError={!!error}
      errorFallback={<ErrorFallback error={error} />}
    >
      <SentryRoutes>
        <Route path="/" element={<FarmsListPage />} />

        <Route path={`/${FarmingRoutes.VersionOne}/:id`} element={<FarmingItemPage />} />
        <Route path={`/${FarmingRoutes.VersionOne}/:id/:tab`} element={<FarmingItemPage />} />

        <Route path={`/:version/:id`} element={<YouvesItemPage />} />
        <Route path={`/:version/:id/:tab`} element={<YouvesItemPage />} />
      </SentryRoutes>
    </StateWrapper>
  );
};
