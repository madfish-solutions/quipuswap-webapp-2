import cx from 'classnames';

import { GlobalModalsStateProvider } from '@providers/use-global-modals-state';
import { Sidebar, Header, AmplitudeSubscription, Advertising } from '@shared/components';
import { CookiesNotification } from '@shared/components/cookie-notification';
import { isMainnet } from '@shared/helpers';
import { AccountModal, DonationModal, SettingsModal, WalletModal } from '@shared/modals';
import { CFC } from '@shared/types';
import { ConfirmationModalProvider, ToastWrapper } from '@shared/utils';

import styles from './layout.module.scss';
import { useLayoutViewModel } from './use-layout.vm';

interface LayoutProps {
  title?: string;
  description?: string;
  image?: string;
  className?: string;
}

export const Layout: CFC<LayoutProps> = ({ title, description, image, className, children }) => {
  const { isComponentDidMount, isDarkTheme } = useLayoutViewModel();

  return (
    <>
      {isComponentDidMount ? (
        <GlobalModalsStateProvider>
          <ConfirmationModalProvider>
            <div className={styles.root}>
              <Header />
              <Sidebar className={styles.sidebar} />
              <div className={cx(styles.mainWrapper, isDarkTheme ? styles.dark : styles.light)}>
                <main className={cx(styles.wrapper, className)}>
                  <ToastWrapper />
                  {isMainnet() && <Advertising />}
                  {children}
                </main>
              </div>
            </div>

            <CookiesNotification />
            <DonationModal />
            <WalletModal />
            <AccountModal />
            <AmplitudeSubscription />
            <SettingsModal />
          </ConfirmationModalProvider>
        </GlobalModalsStateProvider>
      ) : (
        <div />
      )}
    </>
  );
};
