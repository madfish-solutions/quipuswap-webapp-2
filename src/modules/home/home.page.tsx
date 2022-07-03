/* eslint-disable no-console */
import { FC } from 'react';

import { Button } from '@shared/components';
import { TestnetAlert } from '@shared/components/testnet-alert';
import { TokensModal, useChooseTokens } from '@shared/modals/tokens-modal';

import { DexDashboard, News, Opportunities } from './components';

export const HomePage: FC = () => {
  const { chooseTokens } = useChooseTokens();

  const handleButtonClick = async () => {
    console.log('handleButtonClick');
    const tokens = await chooseTokens();
    console.log('After chooseTokens');
    // eslint-disable-next-line no-console
    console.log(tokens);
  };

  return (
    <>
      <TokensModal />
      <Button onClick={handleButtonClick}>Click</Button>
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
