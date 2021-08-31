import React, { useCallback, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { AbortedBeaconError } from '@airgap/beacon-sdk';

import { WalletType } from '@utils/types';
import {
  TEMPLE_WALLET_NOT_INSTALLED_MESSAGE,
  useConnectWithBeacon,
  useConnectWithTemple,
} from '@utils/dapp';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import useUpdateToast from '@hooks/useUpdateToast';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';

import { Checkbox } from '@components/ui/Checkbox';
import { Wallets } from './content';
import s from './WalletModal.module.sass';

type WalletProps = {
  className?: string
  id: WalletType
  Icon: React.FC<{ className?: string }>
  label: string
  onClick: (walletType: WalletType) => void
};

export const Wallet: React.FC<WalletProps> = ({
  id,
  Icon,
  label,
  onClick,
}) => (
  <Button
    className={s.button}
    innerClassName={s.buttonInner}
    textClassName={s.buttonContent}
    theme="secondary"
    onClick={() => onClick(id)}
  >
    <Icon className={s.icon} />
    {label}
  </Button>
);

export const WalletModal: React.FC = () => {
  const { t } = useTranslation(['common']);
  const updateToast = useUpdateToast();
  const [check1, setCheck1] = useState<boolean>(false);
  const [check2, setCheck2] = useState<boolean>(false);

  const {
    connectWalletModalOpen,
    closeConnectWalletModal,
    openInstallTempleWalletModal,
  } = useConnectModalsState();
  const connectWithBeacon = useConnectWithBeacon();
  const connectWithTemple = useConnectWithTemple();

  const handleConnectClick = useCallback(async (walletType: WalletType) => {
    try {
      if (walletType === WalletType.BEACON) {
        await connectWithBeacon(true);
      } else {
        await connectWithTemple(true);
      }
      closeConnectWalletModal();
    } catch (e) {
      if (e.message === TEMPLE_WALLET_NOT_INSTALLED_MESSAGE) {
        openInstallTempleWalletModal();
      } else {
        const authenticationWasRejected = (e.name === 'NotGrantedTempleWalletError') || (e instanceof AbortedBeaconError);
        if (!authenticationWasRejected) {
          updateToast({
            type: 'error',
            render: t('common:errorWhileConnectingWallet', {
              walletName: walletType === WalletType.BEACON ? 'Beacon' : 'Temple Wallet',
              error: e.message,
            }),
          });
        }
      }
    }
  }, [
    closeConnectWalletModal,
    connectWithBeacon,
    connectWithTemple,
    openInstallTempleWalletModal,
    t,
    updateToast,
  ]);

  return (
    <Modal
      containerClassName={s.modalWrap}
      contentClassName={s.modal}
      title={t('common:Connect wallet')}
      isOpen={connectWalletModalOpen}
      onRequestClose={closeConnectWalletModal}
    >
      <div>

        <div className={s.def}>
          <Button onClick={() => setCheck1(!check1)} theme="quaternary" className={s.btn}>
            <Checkbox checked={check1} />
            {' '}
            <div className={s.btnText}>{t('common:Accept terms')}</div>
          </Button>
          {t('common:I have read and agree to the')}
          {' '}
          <Button
            className={s.defText}
            theme="underlined"
            href="#"
            external
          >
            {t('common:Terms of Usage')}
          </Button>
          {' '}
          {t('common:and')}
          {' '}
          <Button
            className={s.defText}
            theme="underlined"
            href="#"
            external
          >
            {t('common:Privacy Policy')}
          </Button>
        </div>
        <div className={s.def}>
          <Button onClick={() => setCheck2(!check2)} theme="quaternary" className={s.btn}>
            <Checkbox checked={check2} />
            {' '}
            <div className={s.btnText}>{t('common:Analytics')}</div>
          </Button>
          {t('common:I agree to the')}
          {' '}
          <Button
            className={s.defText}
            theme="underlined"
            href="#"
            external
          >
            {t('common:anonymous information collecting')}
          </Button>

        </div>
      </div>
      <div className={s.wallets}>
        {Wallets.map(({ id, Icon, label }) => (
          <Wallet
            key={id}
            id={id}
            Icon={Icon}
            label={label}
            onClick={handleConnectClick}
          />
        ))}

      </div>
    </Modal>
  );
};
