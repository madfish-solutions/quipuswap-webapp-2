import { FC } from 'react';

import { Route, Routes } from 'react-router-dom';

import { StateWrapper } from '@shared/components';

import { useFarmingPageViewModel } from './farming-page.vm';
import { FarmingItemPage } from './pages/item';
import { FarmsListPage } from './pages/list';

export const FarmingPage: FC = () => {
  const { isInitialazied } = useFarmingPageViewModel();

  return (
    <StateWrapper isLoading={!isInitialazied} loaderFallback={<div>loading...</div>}>
      <Routes>
        <Route path="/" element={<FarmsListPage />} />
        <Route path="/:farmId/" element={<FarmingItemPage />} />
        <Route path="/:farmId/:tab" element={<FarmingItemPage />} />
      </Routes>
    </StateWrapper>
  );
};
