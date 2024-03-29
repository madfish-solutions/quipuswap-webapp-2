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
  const { isOpen: coinflipModalOpen, open: openCoinflipModal, close: closeCoinflipModal } = useSingleModalState();
  const { isOpen: reconnectModalOpen, open: openReconnectModal, close: closeReconnectModal } = useSingleModalState();

  return {
    installTempleWalletModalOpen,
    connectWalletModalOpen,
    accountInfoModalOpen,
    settingsModalOpen,
    coinflipModalOpen,
    reconnectModalOpen,
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
    closeCoinflipModal,
    openReconnectModal,
    closeReconnectModal
  };
});
