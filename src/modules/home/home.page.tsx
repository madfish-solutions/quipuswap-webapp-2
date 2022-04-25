import { FC } from 'react';

import { TestnetAlert } from '@shared/components/testnet-alert';

import { News, DexDashboard, Opportunities } from './components';

export const HomePage: FC = () => {
  return (
    <>
      <TestnetAlert />
      <News />
      <DexDashboard />
      <Opportunities />
      {/* {IS_NETWORK_MAINNET && <TopPairs />} */}
      {/* TODO: Implement it. */}
      {/* <TopFarmings /> */}
    </>
  );
};
