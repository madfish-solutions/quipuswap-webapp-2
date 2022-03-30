/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { ColorThemeProvider } from '@providers/color-theme-context';

import App from './App';
import { DAppProvider } from './providers/use-dapp';
import { WalletWrapper } from './providers/wallet-wrapper';

require('dotenv').config();

render(
  <ColorThemeProvider>
    <BrowserRouter>
      <DAppProvider>
        <WalletWrapper>
          <App />
        </WalletWrapper>
      </DAppProvider>
    </BrowserRouter>
  </ColorThemeProvider>,
  document.getElementById('root')
);
