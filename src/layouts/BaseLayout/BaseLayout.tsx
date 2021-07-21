import React, { useContext, useEffect } from 'react';
import cx from 'classnames';
import { NextSeo } from 'next-seo';

import { DEFAULT_SEO } from '@utils/default-seo.config';
import { ConnectModalsStateProvider } from '@hooks/useConnectModalsState';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { WalletModal } from '@components/ui/WalletModal';
import { AccountModal } from '@components/ui/AccountModal';
import { Sidebar } from '@components/common/Header/Sidebar';
import { Header } from '@components/common/Header';
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
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          description,
          images: image!! ? [
            {
              url: `${DEFAULT_SEO.WEBSITE_URL}${image}`,
              width: 1200,
              height: 627,
              alt: DEFAULT_SEO.TITLE,
            },
          ] : [],
        }}
        additionalMetaTags={image!! ? [{
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
