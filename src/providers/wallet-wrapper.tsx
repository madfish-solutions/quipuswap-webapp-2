import { FC } from 'react';

import { AccountModal, WalletModal } from '@shared/modals';

import { ConnectModalsStateProvider } from './use-connect-modals-state';

export const WalletWrapper: FC = ({ children }) => {
  return (
    <ConnectModalsStateProvider>
      {children}
      <WalletModal />
      <AccountModal />
    </ConnectModalsStateProvider>
  );
};
