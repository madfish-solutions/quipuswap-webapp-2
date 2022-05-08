import { FC } from 'react';

import { PageTitle, TestnetAlert } from '@shared/components';

import { CoinflipGame } from './components';

export const CoinflipPage: FC = () => {
  return (
    <>
      <TestnetAlert />
      <PageTitle>Game</PageTitle>
      <CoinflipGame />
    </>
  );
};
