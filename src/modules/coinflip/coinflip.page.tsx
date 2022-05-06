import { FC } from 'react';

import { PageTitle, TestnetAlert } from '@shared/components';

export const CoinflipPage: FC = () => {
  return (
    <>
      <TestnetAlert />
      <PageTitle>Game</PageTitle>
    </>
  );
};
