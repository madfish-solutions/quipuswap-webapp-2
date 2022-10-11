import { FC } from 'react';

import { TestnetAlert } from '@shared/components/testnet-alert';

import { DexDashboard, Opportunities } from './components';

export const HomePage: FC = () => (
  <>
    <TestnetAlert />
    <DexDashboard />
    <Opportunities />
    {/* {IS_NETWORK_MAINNET && <TopPairs />} */}
    {/* TODO: Implement it. */}
    {/* <TopFarmings /> */}
  </>
);
