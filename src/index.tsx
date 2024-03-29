import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import 'reflect-metadata';

import { BalancesProvider } from '@providers/balances-provider';
import { ColorThemeProvider } from '@providers/color-theme-context';
import { DAppBakerProvider } from '@providers/dapp-bakers';
import { DAppTokensProvider } from '@providers/dapp-tokens';
import { RootStoreProvider } from '@providers/root-store-provider';
import { DAppProvider } from '@providers/use-dapp';
import { ExchangeRatesProvider, NewExchangeRatesProvider } from '@providers/use-new-exchange-rate';
import { sentryService } from '@shared/services';

import { App } from './app'; //

import './overrides';

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
require('dotenv').config();

const container = document.getElementById('root');

sentryService.init();

if (container) {
  const root = createRoot(container);
  root.render(
    <RootStoreProvider>
      <ColorThemeProvider>
        <BrowserRouter>
          <DAppProvider>
            <ExchangeRatesProvider>
              <NewExchangeRatesProvider>
                <DAppBakerProvider>
                  <DAppTokensProvider>
                    <BalancesProvider>
                      <App />
                    </BalancesProvider>
                  </DAppTokensProvider>
                </DAppBakerProvider>
              </NewExchangeRatesProvider>
            </ExchangeRatesProvider>
          </DAppProvider>
        </BrowserRouter>
      </ColorThemeProvider>
    </RootStoreProvider>
  );
}
