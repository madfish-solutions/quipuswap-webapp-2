import { FC } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import Script from 'next/script';

import { BASE_URL } from '@app.config';
import { useBaseLayoutViewModel } from '@components/common/BaseLayout/use-base-layout.vm';
import { Header } from '@components/common/Header';
import { Sidebar } from '@components/common/Header/Sidebar';
import { AccountModal } from '@components/modals/AccountModal';
import { DonationModal } from '@components/modals/donation-modal';
import { WalletModal } from '@components/modals/WalletModal';
import { Background } from '@components/svg/Background';
import { ToastWrapper } from '@components/ui/toast-wrapper';
import { GlobalModalsStateProvider } from '@hooks/use-global-modals-state';
import { DEFAULT_SEO } from '@seo.config';

import s from './BaseLayout.module.sass';

interface BaseLayoutProps {
  title?: string;
  description?: string;
  image?: string;
  className?: string;
}

export const BaseLayout: FC<BaseLayoutProps> = observer(({ title, description, image, className, children }) => {
  const { isDarkFavicon, canonicalURL, isComponentDidMount } = useBaseLayoutViewModel();

  return (
    <>
      <Head>
        {isDarkFavicon ? (
          <link rel="icon" href={`${BASE_URL}/favicon.ico`} />
        ) : (
          <link rel="icon" href={`${BASE_URL}/light-favicon.ico`} />
        )}
        <link rel="canonical" href={canonicalURL} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_ANALYTICS}`} />
      <Script>
        {`window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${process.env.NEXT_PUBLIC_ANALYTICS}');`}
      </Script>
      <Script>
        {`!function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL}');
        fbq('track', 'PageView');`}
      </Script>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          description,
          images: image
            ? [
                {
                  url: `${DEFAULT_SEO.WEBSITE_URL}${image}`,
                  width: 1200,
                  height: 627,
                  alt: DEFAULT_SEO.TITLE
                }
              ]
            : []
        }}
        additionalMetaTags={
          image
            ? [
                {
                  property: 'image',
                  content: `${DEFAULT_SEO.WEBSITE_URL}${image}`
                }
              ]
            : []
        }
      />
      {isComponentDidMount ? (
        <GlobalModalsStateProvider>
          <div className={s.root}>
            <Header />
            <Sidebar className={s.sidebar} />
            <Background className={s.background} />
            <main className={cx(s.wrapper, className)}>
              <ToastWrapper />
              {children}
            </main>
          </div>

          <WalletModal />
          <AccountModal />
          <DonationModal />
        </GlobalModalsStateProvider>
      ) : (
        <div />
      )}
    </>
  );
});
