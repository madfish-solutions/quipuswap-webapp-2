import { FC } from 'react';
import { AccountModal } from '../shared/modals/AccountModal';
import { WalletModal } from '../shared/modals/WalletModal';
import { DonationModal } from '../shared/modals/donation-modal';
import { ConnectModalsStateProvider } from './use-connect-modals-state';

export const WalletWrapper: FC = ({ children }) => {
  return (
    <ConnectModalsStateProvider>
      {children}
      <WalletModal />
      <AccountModal />
      <DonationModal />
    </ConnectModalsStateProvider>
  );
};
