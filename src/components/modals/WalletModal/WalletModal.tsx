import React, { useCallback, useState } from 'react';
import { AbortedBeaconError } from '@airgap/beacon-sdk';
import { useTranslation } from 'next-i18next';
import { Button, Checkbox, Modal } from '@quipuswap/ui-kit';

import { WalletType } from '@utils/types';
import {
  TEMPLE_WALLET_NOT_INSTALLED_MESSAGE,
  useConnectWithBeacon,
  useConnectWithTemple,
} from '@utils/dapp';
import { SAVED_ANALYTICS_KEY, SAVED_TERMS_KEY } from '@utils/defaults';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import useUpdateToast from '@hooks/useUpdateToast';

import { Wallets } from './content';
import s from './WalletModal.module.sass';

type WalletProps = {
  className?: string;
  id: WalletType;
  Icon: React.FC<{ className?: string }>;
  label: string;
  onClick: (walletType: WalletType) => void;
  disabled?: boolean;
};

export const Wallet: React.FC<WalletProps> = ({
  id,
  Icon,
  label,
  onClick,
  disabled = false,
}) => (
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

export const WalletModal: React.FC = () => {
  const { t } = useTranslation(['common']);
  const updateToast = useUpdateToast();
  const [check1, setCheck1] = useState<boolean>(
    localStorage.getItem(SAVED_TERMS_KEY) === 'true' ?? false,
  );
  const [check2, setCheck2] = useState<boolean>(
    localStorage.getItem(SAVED_ANALYTICS_KEY) === 'true' ?? false,
  );

  const {
    connectWalletModalOpen,
    closeConnectWalletModal,
    openInstallTempleWalletModal,
  } = useConnectModalsState();
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
      } catch (e: any) {
        if (e.message === TEMPLE_WALLET_NOT_INSTALLED_MESSAGE) {
          openInstallTempleWalletModal();
        } else {
          const authenticationWasRejected = e.name === 'NotGrantedTempleWalletError'
            || e instanceof AbortedBeaconError;
          if (!authenticationWasRejected) {
            updateToast({
              type: 'error',
              render: t('common|errorWhileConnectingWallet', {
                walletName:
                  walletType === WalletType.BEACON ? 'Beacon' : 'Temple Wallet',
                error: e.message,
              }),
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
      updateToast,
    ],
  );

  const handleCheck1 = () => {
    setCheck1(!check1);
    localStorage.setItem(SAVED_TERMS_KEY, `${!check1}`);
  };

  const handleCheck2 = () => {
    setCheck2(!check2);
    localStorage.setItem(SAVED_ANALYTICS_KEY, `${!check2}`);
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
          <Button
            control={<Checkbox checked={check1} />}
            onClick={handleCheck1}
            theme="quaternary"
            className={s.btn}
          >
            <div className={s.btnText}>{t('common|Accept terms')}</div>
          </Button>
          {t('common|I have read and agree to the')}
          {' '}
          <Button className={s.defText} theme="underlined" href="#" external>
            {t('common|Terms of Usage')}
          </Button>
          {' '}
          {t('common|and')}
          {' '}
          <Button className={s.defText} theme="underlined" href="#" external>
            {t('common|Privacy Policy')}
          </Button>
        </div>
        <div className={s.def}>
          <Button
            control={<Checkbox checked={check2} />}
            onClick={handleCheck2}
            theme="quaternary"
            className={s.btn}
          >
            <div className={s.btnText}>{t('common|Analytics')}</div>
          </Button>
          {t('common|I agree to the')}
          {' '}
          <Button className={s.defText} theme="underlined" href="#" external>
            {t('common|anonymous information collecting')}
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
            disabled={!check1}
          />
        ))}
      </div>
    </Modal>
  );
};
