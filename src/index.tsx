/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { render } from 'react-dom';

import App from './App';
import { RootStoreProvider } from './providers/root-store-provider';
import { DAppProvider } from './providers/use-dapp';
import { WalletWrapper } from './providers/wallet-wrapper';

require('dotenv').config();

render(
  <RootStoreProvider>
    <DAppProvider>
      <WalletWrapper>
        <App />
      </WalletWrapper>
    </DAppProvider>
  </RootStoreProvider>,
  document.getElementById('root')
);
