import { FC } from 'react';

import { TestnetAlert } from '@shared/components/testnet-alert';

import { DexDashboard, News, Opportunities } from './components';

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
