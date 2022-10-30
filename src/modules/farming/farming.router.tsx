import { FC } from 'react';

import { Route } from 'react-router-dom';

import { StateWrapper } from '@shared/components';
import { SentryRoutes } from '@shared/services';

import { useFarmingRouterViewModel } from './farming-router.vm';
import { FarmingItemPage } from './pages/item';
import { FarmsListPage } from './pages/list';
import { YouvesItemPage } from './pages/youves-item';

export enum FarmingRoutes {
  VersionOne = '/v1',
  VersionTwo = '/v2'
}

export const FarmingRouter: FC = () => {
  const { isInitialized } = useFarmingRouterViewModel();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<div>Loading...</div>}>
      <SentryRoutes>
        <Route path="/" element={<FarmsListPage />} />
        <Route path={`${FarmingRoutes.VersionOne}/:id`} element={<FarmingItemPage />} />
        <Route path={`${FarmingRoutes.VersionOne}/:id/:tab`} element={<FarmingItemPage />} />
        <Route path={`${FarmingRoutes.VersionTwo}/:id`} element={<YouvesItemPage />} />
        <Route path={`${FarmingRoutes.VersionTwo}/:id/:tab`} element={<YouvesItemPage />} />
      </SentryRoutes>
    </StateWrapper>
  );
};
