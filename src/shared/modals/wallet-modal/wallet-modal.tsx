import { FC, useCallback } from 'react';

import { AbortedBeaconError } from '@airgap/beacon-sdk';
import { Button, Modal } from '@quipuswap/ui-kit';

import { Wallets } from './content';
import s from './wallet-modal.module.sass';
import { WalletType } from 'types/types';
import { useConnectModalsState } from '@providers';
import { useConnectWithBeacon, useConnectWithTemple, TEMPLE_WALLET_NOT_INSTALLED_MESSAGE } from '@providers';

interface WalletProps {
  className?: string;
  id: WalletType;
  Icon: FC<{ className?: string }>;
  label: string;
  onClick: (walletType: WalletType) => void;
  disabled?: boolean;
}

export const Wallet: FC<WalletProps> = ({ id, Icon, label, onClick, disabled = false }) => (
  <Button
    className={s.button}
    innerClassName={s.buttonInner}
    textClassName={s.buttonContent}
    theme="secondary"
    onClick={() => !disabled && onClick(id)}
    disabled={disabled}
  >
    <Icon className={s.icon} />
    <span>{label}</span>
  </Button>
);

export const WalletModal: FC = () => {
  const { connectWalletModalOpen, closeConnectWalletModal, openInstallTempleWalletModal } = useConnectModalsState();
  const { closeAccountInfoModal } = useConnectModalsState();
  const connectWithBeacon = useConnectWithBeacon();
  const connectWithTemple = useConnectWithTemple();

  const handleConnectClick = useCallback(
    async (walletType: WalletType) => {
      try {
        if (walletType === WalletType.BEACON) {
          await connectWithBeacon(true);
        } else {
          await connectWithTemple(true);
        }
        closeAccountInfoModal();
        closeConnectWalletModal();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e.message === TEMPLE_WALLET_NOT_INSTALLED_MESSAGE) {
          openInstallTempleWalletModal();
        } else {
          const authenticationWasRejected = e.name === 'NotGrantedTempleWalletError' || e instanceof AbortedBeaconError;
          if (!authenticationWasRejected) {
            // eslint-disable-next-line no-console
            console.error(e);
          }
        }
      }
    },
    [closeAccountInfoModal, closeConnectWalletModal, connectWithBeacon, connectWithTemple, openInstallTempleWalletModal]
  );

  return (
    <Modal
      containerClassName={s.modalWrap}
      contentClassName={s.modal}
      title="Connect wallet"
      isOpen={connectWalletModalOpen}
      onRequestClose={closeConnectWalletModal}
    >
      <div className={s.wallets}>
        {Wallets.map(({ id, Icon, label }) => (
          <Wallet key={id} id={id} Icon={Icon} label={label} onClick={handleConnectClick} />
        ))}
      </div>
    </Modal>
  );
};
