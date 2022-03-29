import { FC } from 'react';

import cx from 'classnames';

// import { BASE_URL } from '../app.config'; 
import { useBaseLayoutViewModel } from './use-layout.vm';
import { Header } from '@shared/components/header';
import { Sidebar } from '@shared/components/sidebar'; // shared/components
// import { AccountModal } from '../shared/modals/AccountModal';
// import { DonationModal } from '../shared/modals/donation-modal'; // sharded/modals
// import { WalletModal } from '../shared/modals/WalletModal';
import { Background } from '@shared/svg/Background'; // shared/svg
import { ToastWrapper } from '@providers'; // provider
// import { GlobalModalsStateProvider } from '../shared/hooks/use-global-modals-state'; // shared/hooks
// import { DEFAULT_SEO } from '../seo.config';

import s from './layout.module.scss';

interface BaseLayoutProps {
  title?: string;
  description?: string;
  image?: string;
  className?: string;
}

export const Layout: FC<BaseLayoutProps> = ({ title, description, image, className, children }) => {
  const { isDarkFavicon, canonicalURL, isComponentDidMount } = useBaseLayoutViewModel();

  return (
    <>
      {/* <Head>
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
      /> */}
      {isComponentDidMount ? (
        <div className={s.root}>
          <Header />
          <Sidebar className={s.sidebar} />
          <Background className={s.background} />
          <main className={cx(s.wrapper, className)}>
            <ToastWrapper />
            {children}
          </main>
        </div>
      ) : (
        <div />
      )}
    </>
  );
}
