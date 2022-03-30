import constate from 'constate';

import { useSingleModalState } from './use-single-modal-state';

export const [GlobalModalsStateProvider, useGlobalModalsState] = constate(() => {
  const {
    isOpen: installTempleWalletModalOpen,
    open: openInstallTempleWalletModal,
    close: closeInstallTempleWalletModal
  } = useSingleModalState();
  const {
    isOpen: connectWalletModalOpen,
    open: openConnectWalletModal,
    close: closeConnectWalletModal
  } = useSingleModalState();
  const {
    isOpen: accountInfoModalOpen,
    open: openAccountInfoModal,
    close: closeAccountInfoModal
  } = useSingleModalState();
  const { isOpen: donationModalOpen, open: openDonationModal, close: closeDonationModal } = useSingleModalState();

  return {
    installTempleWalletModalOpen,
    connectWalletModalOpen,
    accountInfoModalOpen,
    openInstallTempleWalletModal,
    closeInstallTempleWalletModal,
    openConnectWalletModal,
    closeConnectWalletModal,
    openAccountInfoModal,
    closeAccountInfoModal,
    donationModalOpen,
    openDonationModal,
    closeDonationModal
  };
});
