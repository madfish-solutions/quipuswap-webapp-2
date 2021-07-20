import constate from 'constate';
import { useState, useCallback } from 'react';

export const [
  ConnectModalsStateProvider,
  useConnectModalsState,
] = constate(() => {
  const [installTempleWalletModalOpen, setInstallTempleWalletModalOpen] = useState(false);
  const [connectWalletModalOpen, setConnectWalletModalOpen] = useState(false);
  const [accountInfoModalOpen, setAccountInfoModalOpen] = useState(false);
  const [networkAddModalOpen, setNetworkAddModalOpen] = useState(false);

  const openInstallTempleWalletModal = useCallback(() => setInstallTempleWalletModalOpen(true), []);
  const closeInstallTempleWalletModal = useCallback(
    () => setInstallTempleWalletModalOpen(false),
    [],
  );
  const openConnectWalletModal = useCallback(() => setConnectWalletModalOpen(true), []);
  const closeConnectWalletModal = useCallback(() => setConnectWalletModalOpen(false), []);
  const openAccountInfoModal = useCallback(() => setAccountInfoModalOpen(true), []);
  const closeAccountInfoModal = useCallback(() => setAccountInfoModalOpen(false), []);
  const openNetworkAddModal = useCallback(() => setNetworkAddModalOpen(true), []);
  const closeNetworkAddModal = useCallback(() => setNetworkAddModalOpen(false), []);

  return {
    installTempleWalletModalOpen,
    connectWalletModalOpen,
    accountInfoModalOpen,
    networkAddModalOpen,
    openInstallTempleWalletModal,
    closeInstallTempleWalletModal,
    openConnectWalletModal,
    closeConnectWalletModal,
    openAccountInfoModal,
    closeAccountInfoModal,
    openNetworkAddModal,
    closeNetworkAddModal,
  };
});
