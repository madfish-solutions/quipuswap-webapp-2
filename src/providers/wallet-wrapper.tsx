import { FC } from 'react';

import { AccountModal } from '../shared/modals/account-modal';
import { WalletModal } from '../shared/modals/wallet-modal';
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
