/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { render } from 'react-dom';

import { RootStoreProvider, DAppProvider, WalletWrapper } from '@providers';

import App from './App';

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
