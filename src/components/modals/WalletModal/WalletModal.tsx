import React, { FC, useCallback, useState } from 'react';

import { AbortedBeaconError } from '@airgap/beacon-sdk';
import { Button, Checkbox, Modal } from '@quipuswap/ui-kit';
import { NotGrantedTempleWalletError } from '@temple-wallet/dapp';

import { SAVED_TERMS_KEY } from '@app.config';
import { appi18n } from '@app.i18n';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import useUpdateToast from '@hooks/useUpdateToast';
import { useConnectWithBeacon, useConnectWithTemple } from '@utils/dapp';
import { WalletType } from '@utils/types';

import { NoTempleWalletError } from '../../../errors/NoTempleWalletError.error';
import { Wallets } from './content';
import s from './WalletModal.module.sass';

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
    onClick={() => onClick(id)}
    disabled={disabled}
  >
    <Icon className={s.icon} />
    <span>{label}</span>
  </Button>
);

export const WalletModal: FC = () => {
  const { t } = appi18n;
  const updateToast = useUpdateToast();
  const [check1, setCheck1] = useState<boolean>(localStorage.getItem(SAVED_TERMS_KEY) === 'true' ?? false);

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
      } catch (err) {
        if (err instanceof NoTempleWalletError) {
          openInstallTempleWalletModal();
        } else {
          const authenticationWasRejected =
            err instanceof NotGrantedTempleWalletError || err instanceof AbortedBeaconError;
          if (!authenticationWasRejected) {
            updateToast({
              type: 'error',
              render: t('common|errorWhileConnectingWallet', {
                walletName: walletType === WalletType.BEACON ? 'Beacon' : 'Temple Wallet',
                error: (err as Error).message
              })
            });
          }
        }
      }
    },
    [
      closeAccountInfoModal,
      closeConnectWalletModal,
      connectWithBeacon,
      connectWithTemple,
      openInstallTempleWalletModal,
      t,
      updateToast
    ]
  );

  const handleCheck1 = () => {
    setCheck1(!check1);
    localStorage.setItem(SAVED_TERMS_KEY, `${!check1}`);
  };

  return (
    <Modal
      containerClassName={s.modalWrap}
      contentClassName={s.modal}
      title={t('common|Connect wallet')}
      isOpen={connectWalletModalOpen}
      onRequestClose={closeConnectWalletModal}
    >
      <div className={s.terms}>
        <div className={s.def}>
          <Button control={<Checkbox checked={check1} />} onClick={handleCheck1} theme="quaternary" className={s.btn}>
            <div className={s.btnText}>{t('common|Accept terms')}</div>
          </Button>
          {t('common|I have read and agree to the')}{' '}
          <Button className={s.defText} theme="underlined" href="/terms-of-service" external>
            {t('common|Terms of Usage')}
          </Button>{' '}
          {t('common|and')}{' '}
          <Button className={s.defText} theme="underlined" href="/privacy-policy" external>
            {t('common|Privacy Policy')}
          </Button>
        </div>
      </div>
      <div className={s.wallets}>
        {Wallets.map(({ id, Icon, label }) => (
          <Wallet key={id} id={id} Icon={Icon} label={label} onClick={handleConnectClick} disabled={!check1} />
        ))}
      </div>
    </Modal>
  );
};
