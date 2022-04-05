import { FC } from 'react';

import cx from 'classnames';

import { Sidebar, Header } from '@shared/components';
import { GlobalModalsStateProvider } from '@providers/use-global-modals-state';
import { AccountModal, WalletModal } from '@shared/modals';
import { Background } from '@shared/svg';
import { ToastWrapper } from '@shared/utils';

import styles from './layout.module.scss';
import { useLayoutViewModel } from './use-layout.vm';

interface LayoutProps {
  title?: string;
  description?: string;
  image?: string;
  className?: string;
}

export const Layout: FC<LayoutProps> = ({ title, description, image, className, children }) => {
  const { isComponentDidMount } = useLayoutViewModel();

  return (
    <>
      {isComponentDidMount ? (
        <GlobalModalsStateProvider>
          <div className={styles.root}>
            <Header />
            <Sidebar className={styles.sidebar} />
            <Background className={styles.background} />
            <main className={cx(styles.wrapper, className)}>
              <ToastWrapper />
              {children}
            </main>
          </div>

          <WalletModal />
          <AccountModal />
          {/* <DonationModal /> */}
        </GlobalModalsStateProvider>
      ) : (
        <div />
      )}
    </>
  );
};
