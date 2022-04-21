/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { BalancesProvider } from '@providers/balances-provider';
import { ColorThemeProvider } from '@providers/color-theme-context';
import { DAppBakerProvider } from '@providers/dapp-bakers';
import { DAppTokensProvider } from '@providers/dapp-tokens';
import { RootStoreProvider } from '@providers/root-store-provider';
import { DAppProvider } from '@providers/use-dapp';
import { ExchangeRatesProvider, NewExchangeRatesProvider } from '@providers/use-new-exchange-rate';
import { DexGraphProvider } from '@shared/hooks';

import { App } from './App';

require('dotenv').config();

render(
  <RootStoreProvider>
    <ColorThemeProvider>
      <BrowserRouter>
        <DAppProvider>
          <ExchangeRatesProvider>
            <NewExchangeRatesProvider>
              <DAppBakerProvider>
                <DAppTokensProvider>
                  <BalancesProvider>
                    <DexGraphProvider>
                      <App />
                    </DexGraphProvider>
                  </BalancesProvider>
                </DAppTokensProvider>
              </DAppBakerProvider>
            </NewExchangeRatesProvider>
          </ExchangeRatesProvider>
        </DAppProvider>
      </BrowserRouter>
    </ColorThemeProvider>
  </RootStoreProvider>,

  document.getElementById('root')
);
