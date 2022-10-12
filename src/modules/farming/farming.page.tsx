import { FC } from 'react';

import { Route } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { StateWrapper } from '@shared/components';
import { SentryRoutes } from '@shared/services';

import { useFarmingPageViewModel } from './farming-page.vm';
import { FarmingItemPage } from './pages/item';
import { FarmsListPage } from './pages/list';
import { YouvesFarmingItemPage } from './pages/youves-item';

export const FarmingPage: FC = () => {
  const { isInitialized } = useFarmingPageViewModel();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<div>loading...</div>}>
      <SentryRoutes>
        <Route path="/" element={<FarmsListPage />} />
        <Route path={`${AppRootRoutes.VersionOne}/:id/:tab`} element={<FarmingItemPage />} />
        <Route path="/:id" element={<YouvesFarmingItemPage />} />
      </SentryRoutes>
    </StateWrapper>
  );
};
