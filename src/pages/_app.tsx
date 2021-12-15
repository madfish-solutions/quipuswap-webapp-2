import React, { useEffect } from 'react';

import { ColorThemeProvider } from '@quipuswap/ui-kit';
import { appWithTranslation } from 'next-i18next';
import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { withApollo } from '@client';
import { DexGraphProvider } from '@hooks/useDexGraph';
import { ExchangeRatesProvider } from '@hooks/useExchangeRate';
import { NewExchangeRatesProvider } from '@hooks/useNewExchangeRate';
import '@quipuswap/ui-kit/dist/ui-kit.cjs.development.css';
import '@styles/globals.sass';
import { DAppProvider } from '@utils/dapp';
import { DEFAULT_SEO } from '@utils/default-seo.config';
import { debounce } from '@utils/helpers';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // prevents flashing
    const debouncedHandleResize = debounce(() => {
      const vh = window.innerHeight * 0.01;
      if (vh !== 0) {
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }
    }, 1000);
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" />
        <link rel="apple-touch-icon" sizes="48x48" href="/icons/icon-48x48.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/icons/icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="96x96" href="/icons/icon-96x96.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="256x256" href="/icons/icon-256x256.png" />
        <link rel="apple-touch-icon" sizes="384x384" href="/icons/icon-384x384.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />
      </Head>

      <DAppProvider>
        <ColorThemeProvider>
          <ExchangeRatesProvider>
            <NewExchangeRatesProvider>
              <DexGraphProvider>
                <Component {...pageProps} />
              </DexGraphProvider>
            </NewExchangeRatesProvider>
          </ExchangeRatesProvider>
        </ColorThemeProvider>
      </DAppProvider>
    </>
  );
}

// eslint-disable-next-line import/no-default-export
export default withApollo()(appWithTranslation(MyApp));
