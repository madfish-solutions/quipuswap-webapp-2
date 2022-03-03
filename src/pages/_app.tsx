import React from 'react';

import { ColorThemeProvider } from '@quipuswap/ui-kit';
import { appWithTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import Head from 'next/head';

import { useAppViewModel } from '@hooks/use-app.vm';
import { DexGraphProvider } from '@hooks/use-dex-graph';
import { NewExchangeRatesProvider } from '@hooks/use-new-exchange-rate';
import { ExchangeRatesProvider } from '@hooks/useExchangeRate';
import { withApollo } from '@hooks/withApollo';
import { BalancesProvider } from '@providers/BalancesProvider';
import { RootStoreProvider } from '@providers/root-store-provider';
import { DAppBakerProvider, DAppProvider, DAppTokensProvider } from '@utils/dapp';

import '@quipuswap/ui-kit/dist/ui-kit.cjs.development.css';
import '@styles/globals.sass';

const App = ({ Component, pageProps }: AppProps) => {
  const { title, description, titleTemplate, defaultTitle, openGraph, twitter, additionalMetaTags } = useAppViewModel();

  return (
    <>
      <DefaultSeo
        title={title}
        titleTemplate={titleTemplate}
        defaultTitle={defaultTitle}
        description={description}
        openGraph={openGraph}
        twitter={twitter}
        additionalMetaTags={additionalMetaTags}
      />
      <Head>
        {/* Fonts */}
        <link href="/fonts/style.css" rel="stylesheet" />
        {/* Favicons */}
        <link rel="icon" id="favicon" href="/favicon.ico" />
      </Head>

      <RootStoreProvider>
        <DAppProvider>
          <DAppBakerProvider>
            <DAppTokensProvider>
              <ColorThemeProvider>
                <BalancesProvider>
                  <ExchangeRatesProvider>
                    <NewExchangeRatesProvider>
                      <DexGraphProvider>
                        <Component {...pageProps} />
                      </DexGraphProvider>
                    </NewExchangeRatesProvider>
                  </ExchangeRatesProvider>
                </BalancesProvider>
              </ColorThemeProvider>
            </DAppTokensProvider>
          </DAppBakerProvider>
        </DAppProvider>
      </RootStoreProvider>
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'privacy']))
  }
});

// eslint-disable-next-line import/no-default-export
export default withApollo()(appWithTranslation(App));
