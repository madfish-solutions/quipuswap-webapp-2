/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { DAppBakerProvider } from '@providers/dapp-bakers';
import { DAppTokensProvider } from '@providers/dapp-tokens';

import App from './App';
import { ColorThemeProvider } from './providers/color-theme-context';
import { RootStoreProvider } from './providers/root-store-provider';
import { DAppProvider } from './providers/use-dapp';
import { WalletWrapper } from './providers/wallet-wrapper';

require('dotenv').config();

render(
  <RootStoreProvider>
    <ColorThemeProvider>
      <BrowserRouter>
        <DAppProvider>
          <DAppBakerProvider>
            <DAppTokensProvider>
              <WalletWrapper>
                <App />
              </WalletWrapper>
            </DAppTokensProvider>
          </DAppBakerProvider>
        </DAppProvider>
      </BrowserRouter>
    </ColorThemeProvider>
  </RootStoreProvider>,

  document.getElementById('root')
);
