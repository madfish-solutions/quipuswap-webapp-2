import React, { useEffect } from 'react';

import { ColorThemeProvider } from '@quipuswap/ui-kit';
import { appWithTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { DexGraphProvider } from '@hooks/use-dex-graph';
import { NewExchangeRatesProvider } from '@hooks/use-new-exchange-rate';
import { ExchangeRatesProvider } from '@hooks/useExchangeRate';
import { withApollo } from '@hooks/withApollo';
import { BalancesProvider } from '@providers/BalancesProvider';
import { DEFAULT_SEO } from '@seo.config';
import { DAppProvider, DAppTokensProvider, DAppBakerProvider } from '@utils/dapp';
import { debounce } from '@utils/helpers';
import '@quipuswap/ui-kit/dist/ui-kit.cjs.development.css';
import '@styles/globals.sass';

const RESIZE_DEBOUNCE = 1000; // 1 sec
const HEIGHT_KOEF = 0.01;
const HEIGHT_EMPTY = 0;

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

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

  const languageAlternates: { hrefLang: string; href: string }[] = [];
  router.locales?.forEach(el => {
    languageAlternates.push({
      hrefLang: el,
      href: `${DEFAULT_SEO.WEBSITE_URL}${el}${router.pathname}`
    });
  });

  const description = DEFAULT_SEO.DESCRIPTION;

  return (
    <>
      <DefaultSeo
        title={undefined}
        titleTemplate={`${DEFAULT_SEO.TITLE}`}
        defaultTitle={DEFAULT_SEO.TITLE}
        description={description}
        openGraph={{
          type: DEFAULT_SEO.OG.TYPE,
          locale: router.locale || 'en_US',
          url: DEFAULT_SEO.WEBSITE_URL,
          site_name: DEFAULT_SEO.OG.SITE_NAME,
          title: DEFAULT_SEO.TITLE,
          description,
          images: [
            {
              url: `${DEFAULT_SEO.WEBSITE_URL}${DEFAULT_SEO.IMAGE}`,
              width: 1200,
              height: 627,
              alt: DEFAULT_SEO.TITLE
            }
          ]
        }}
        twitter={{
          handle: DEFAULT_SEO.TWITTER.HANDLE,
          site: DEFAULT_SEO.TWITTER.SITE,
          cardType: DEFAULT_SEO.TWITTER.CARD_TYPE
        }}
        languageAlternates={languageAlternates.length > 0 ? languageAlternates : undefined}
        additionalMetaTags={[
          {
            property: 'image',
            content: `${DEFAULT_SEO.WEBSITE_URL}${DEFAULT_SEO.IMAGE}`
          }
        ]}
      />
      <Head>
        {/* Fonts */}
        <link href="/fonts/style.css" rel="stylesheet" />
        {/* Favicons */}
        <link rel="icon" id="favicon" href="/favicon.ico" />
      </Head>

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
