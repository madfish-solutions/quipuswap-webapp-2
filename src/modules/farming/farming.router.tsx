import { FC } from 'react';

import { Route } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { StateWrapper } from '@shared/components';
import { SentryRoutes } from '@shared/services';

import { useFarmingRouterViewModel } from './farming-router.vm';
import { FarmingItemPage } from './pages/item';
import { FarmsListPage } from './pages/list';
import { YouvesItemPage } from './pages/youves-item';

export enum FarmingRoutes {
  Youves = '/youves'
}

export const FarmingRouter: FC = () => {
  const { isInitialized } = useFarmingRouterViewModel();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<div>Loading...</div>}>
      <SentryRoutes>
        <Route path="/" element={<FarmsListPage />} />
        <Route path={`${AppRootRoutes.VersionOne}/:id`} element={<FarmingItemPage />} />
        <Route path={`${AppRootRoutes.VersionOne}/:id/:tab`} element={<FarmingItemPage />} />
        <Route path={`${FarmingRoutes.Youves}/:id`} element={<YouvesItemPage />} />
        <Route path={`${FarmingRoutes.Youves}/:id/:tab`} element={<YouvesItemPage />} />
      </SentryRoutes>
    </StateWrapper>
  );
};
