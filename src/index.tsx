import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { BalancesProvider } from '@providers/balances-provider';
import { ColorThemeProvider } from '@providers/color-theme-context';
import { DAppBakerProvider } from '@providers/dapp-bakers';
import { DAppTokensProvider } from '@providers/dapp-tokens';
import { RootStoreProvider } from '@providers/root-store-provider';
import { DAppProvider } from '@providers/use-dapp';
import { ExchangeRatesProvider, NewExchangeRatesProvider } from '@providers/use-new-exchange-rate';
import { DexGraphProvider } from '@shared/hooks';

import { App } from './app';

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
require('dotenv').config();

const container = document.getElementById('root');

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
    </RootStoreProvider>
  );
}
