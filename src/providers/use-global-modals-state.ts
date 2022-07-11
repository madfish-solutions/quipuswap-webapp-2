import constate from 'constate';

import { useSingleModalState } from '@shared/hooks';

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
  const { isOpen: settingsModalOpen, open: openSettingsModal, close: closeSettingsModal } = useSingleModalState();
  const { isOpen: coinflipModalOpen, open: openCoinflipModal, close: closeCoinflipsModal } = useSingleModalState();

  return {
    installTempleWalletModalOpen,
    connectWalletModalOpen,
    accountInfoModalOpen,
    settingsModalOpen,
    coinflipModalOpen,
    openInstallTempleWalletModal,
    closeInstallTempleWalletModal,
    openConnectWalletModal,
    closeConnectWalletModal,
    openAccountInfoModal,
    closeAccountInfoModal,
    donationModalOpen,
    openDonationModal,
    closeDonationModal,
    openSettingsModal,
    closeSettingsModal,
    openCoinflipModal,
    closeCoinflipsModal
  };
});
