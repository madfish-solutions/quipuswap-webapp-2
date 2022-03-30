import { FC } from 'react';

import cx from 'classnames';

import { ToastWrapper } from '@shared/components/toast-wrapper';
import { GlobalModalsStateProvider } from '@shared/hooks/use-global-modals-state';
import { AccountModal } from '@shared/modals/account-modal';
import { WalletModal } from '@shared/modals/wallet-modal';
import { Background } from '@shared/svg/Background';

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
            {/* <Header /> */}
            {/* <Sidebar className={s.sidebar} /> */}
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
