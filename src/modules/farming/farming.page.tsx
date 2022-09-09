import { FC } from 'react';

import { Route } from 'react-router-dom';

import { StateWrapper } from '@shared/components';
import { SentryRoutes } from '@shared/services';

import { useFarmingPageViewModel } from './farming-page.vm';
import { FarmingItemPage } from './pages/item';
import { FarmsListPage } from './pages/list';

export const FarmingPage: FC = () => {
  const { isInitialazied } = useFarmingPageViewModel();

  return (
    <StateWrapper isLoading={!isInitialazied} loaderFallback={<div>loading...</div>}>
      <SentryRoutes>
        <Route path="/" element={<FarmsListPage />} />
        <Route path="/*" element={<FarmingItemPage />} />
      </SentryRoutes>
    </StateWrapper>
  );
};
