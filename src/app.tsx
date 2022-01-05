import React, { FC, useEffect, useRef } from 'react';

import { ApolloProvider } from '@apollo/client';
import { ColorThemeProvider } from '@quipuswap/ui-kit';

import { DexGraphProvider } from '@hooks/use-dex-graph';
import { ExchangeRatesProvider } from '@hooks/useExchangeRate';
import { NewExchangeRatesProvider } from '@hooks/useNewExchangeRate';
import { BalancesProvider } from '@providers/BalancesProvider';
import { createApolloClient } from '@utils/createApolloClient';
import { DAppProvider } from '@utils/dapp';
import { debounce } from '@utils/helpers';

import '@quipuswap/ui-kit/dist/ui-kit.cjs.development.css';
import '@styles/globals.sass';
import { AppRouter } from './app.router';

const RESIZE_DEBOUNCE = 1000; // 1 sec
const HEIGHT_KOEF = 0.01;
const HEIGHT_EMPTY = 0;

export const App: FC = () => {
  const apolloClient = useRef(createApolloClient());

  useEffect(() => {
    // prevents flashing
    const debouncedHandleResize = debounce(() => {
      const vh = window.innerHeight * HEIGHT_KOEF;
      if (vh !== HEIGHT_EMPTY) {
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }
    }, RESIZE_DEBOUNCE);
    debouncedHandleResize();

    window.addEventListener('resize', debouncedHandleResize);

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, []);

  return (
    <ApolloProvider client={apolloClient.current}>
      <DAppProvider>
        <ColorThemeProvider>
          <BalancesProvider>
            <ExchangeRatesProvider>
              <NewExchangeRatesProvider>
                <DexGraphProvider>
                  <AppRouter />
                </DexGraphProvider>
              </NewExchangeRatesProvider>
            </ExchangeRatesProvider>
          </BalancesProvider>
        </ColorThemeProvider>
      </DAppProvider>
    </ApolloProvider>
  );
};
