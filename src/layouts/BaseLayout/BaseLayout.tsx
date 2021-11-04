import React, { useContext, useEffect } from 'react';
import { ToastWrapper, Header } from '@madfish-solutions/quipu-ui-kit';
import { NextSeo } from 'next-seo';
import Script from 'next/script';
import cx from 'classnames';

import { DEFAULT_SEO } from '@utils/default-seo.config';
import { ConnectModalsStateProvider } from '@hooks/useConnectModalsState';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Sidebar } from '@components/common/Header/Sidebar';
import { WalletModal } from '@components/modals/WalletModal';
import { AccountModal } from '@components/modals/AccountModal';
import { Background } from '@components/svg/Background';

import s from './BaseLayout.module.sass';

interface BaseLayoutProps {
  title?: string,
  description?: string,
  image?: string,
  className?: string;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  title,
  description,
  image,
  className,
  children,
}) => {
  const { colorThemeMode, isComponentDidMount } = useContext(ColorThemeContext);

  useEffect(() => {
    if (colorThemeMode === ColorModes.Dark) {
      document.querySelector('body')?.classList.add(ColorModes.Dark);
    } else {
      document.querySelector('body')?.classList.remove(ColorModes.Dark);
    }
  }, [colorThemeMode]);

  return (
    <>
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
          images: image ? [
            {
              url: `${DEFAULT_SEO.WEBSITE_URL}${image}`,
              width: 1200,
              height: 627,
              alt: DEFAULT_SEO.TITLE,
            },
          ] : [],
        }}
        additionalMetaTags={image ? [{
          property: 'image',
          content: `${DEFAULT_SEO.WEBSITE_URL}${image}`,
        }] : []}
      />
      {isComponentDidMount ? (
        <ConnectModalsStateProvider>
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
        </ConnectModalsStateProvider>
      ) : <div />}
    </>
  );
};
