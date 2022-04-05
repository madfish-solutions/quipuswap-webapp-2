import { FC } from 'react';

import { AccountModal, WalletModal } from '@shared/modals';

import { GlobalModalsStateProvider } from './use-global-modals-state';

export const WalletWrapper: FC = ({ children }) => {
  return (
    <GlobalModalsStateProvider>
      {children}
      <WalletModal />
      <AccountModal />
    </GlobalModalsStateProvider>
  );
};
