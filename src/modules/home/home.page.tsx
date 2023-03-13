import { FC } from 'react';

import { useSignMessage } from '@providers/use-dapp';
import { Button } from '@shared/components';
import { TestnetAlert } from '@shared/components/testnet-alert';

import { DexDashboard, Opportunities } from './components';

export const HomePage: FC = () => {
  const signMessage = useSignMessage();

  return (
    <>
      <Button onClick={async () => await signMessage('lol')}>Sign Message</Button>
      <TestnetAlert />
      <DexDashboard />
      <Opportunities />
      {/* {IS_NETWORK_MAINNET && <TopPairs />} */}
      {/* TODO: Implement it. */}
      {/* <TopFarmings /> */}
    </>
  );
};
