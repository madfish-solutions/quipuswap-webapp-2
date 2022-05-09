import { FC } from 'react';

import { PageTitle, StateWrapper, TestnetAlert } from '@shared/components';

import { useCoinflipPageViewModel } from './coinflip-page.vm';
import { CoinflipGame, CoinflipTokenSelector } from './components';

export const CoinflipPage: FC = () => {
  const { isInitialized } = useCoinflipPageViewModel();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<div>loading...</div>}>
      <TestnetAlert />
      <PageTitle>Game</PageTitle>
      <CoinflipTokenSelector />
      <div style={{ width: '50%' }}>
        <CoinflipGame />
      </div>
    </StateWrapper>
  );
};
