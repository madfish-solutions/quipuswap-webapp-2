import React, { useContext, useEffect } from 'react';

import { ColorModes, ToastWrapper, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { Header } from '@components/common/Header';
import { Sidebar } from '@components/common/Header/Sidebar';
import { AccountModal } from '@components/modals/AccountModal';
import { WalletModal } from '@components/modals/WalletModal';
import { Background } from '@components/svg/Background';
import { ConnectModalsStateProvider } from '@hooks/useConnectModalsState';

import s from './BaseLayout.module.sass';

interface BaseLayoutProps {
  title?: string;
  description?: string;
  image?: string;
  className?: string;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ title, description, image, className, children }) => {
  const { colorThemeMode, isComponentDidMount } = useContext(ColorThemeContext);

  useEffect(() => {
    if (colorThemeMode === ColorModes.Dark) {
      document.querySelector('body')?.classList.add(ColorModes.Dark);
    } else {
      document.querySelector('body')?.classList.remove(ColorModes.Dark);
    }
  }, [colorThemeMode]);

  // TODO: Add scripts
  return (
    <>
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
      ) : (
        <div />
      )}
    </>
  );
};
