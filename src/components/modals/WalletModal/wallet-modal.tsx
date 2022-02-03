import React, { FC, useCallback, useEffect, useState } from 'react';

import { AbortedBeaconError } from '@airgap/beacon-sdk';
import { Checkbox } from '@quipuswap/ui-kit';
import { NotGrantedTempleWalletError, TempleWallet } from '@temple-wallet/dapp';
import { useTranslation } from 'next-i18next';

import { SAVED_TERMS_KEY } from '@app.config';
import { Modal } from '@components/modals/Modal';
import { WalletButton } from '@components/modals/WalletModal/wallet-button';
import { Button } from '@components/ui/elements/button';
import { NoTempleWallet } from '@errors';
import { useToasts } from '@hooks/use-toasts';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import { useConnectWithBeacon, useConnectWithTemple } from '@utils/dapp';
import { WalletType } from '@utils/types';

import { Beacon, Temple } from './content';
import s from './WalletModal.module.sass';

const INSTALL_TEMPLE = 'Install Temple';

export const WalletModal: FC = () => {
  const { t } = useTranslation(['common']);
  const { showErrorToast } = useToasts();
  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(
    localStorage.getItem(SAVED_TERMS_KEY) === 'true' ?? false
  );

  const { connectWalletModalOpen, closeConnectWalletModal, openInstallTempleWalletModal } = useConnectModalsState();
  const { closeAccountInfoModal } = useConnectModalsState();
  const connectWithBeacon = useConnectWithBeacon();
  const connectWithTemple = useConnectWithTemple();
  const [isTempleInstalled, setIsTempleInstalled] = useState(true);

  useEffect(() => {
    TempleWallet.isAvailable().then(setIsTempleInstalled);
  }, []);

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
        if (err instanceof NoTempleWallet) {
          openInstallTempleWalletModal();
        } else {
          const authenticationWasRejected =
            err instanceof NotGrantedTempleWalletError || err instanceof AbortedBeaconError;
          if (!authenticationWasRejected) {
            const errorMessage = t('common|errorWhileConnectingWallet', {
              walletName: walletType === WalletType.BEACON ? 'Beacon' : 'Temple Wallet',
              error: (err as Error).message
            });

            showErrorToast(errorMessage);
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
      showErrorToast
    ]
  );

  const handleCheck1 = () => {
    setIsTermsAccepted(!isTermsAccepted);
    localStorage.setItem(SAVED_TERMS_KEY, `${!isTermsAccepted}`);
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
            control={<Checkbox checked={isTermsAccepted} />}
            onClick={handleCheck1}
            theme="quaternary"
            className={s.btn}
          >
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
        <WalletButton
          available={isTempleInstalled}
          id={Temple.id}
          Icon={Temple.Icon}
          label={isTempleInstalled ? Temple.label : INSTALL_TEMPLE}
          onClick={handleConnectClick}
          disabled={!isTermsAccepted}
        />
        <WalletButton
          id={Beacon.id}
          Icon={Beacon.Icon}
          label={Beacon.label}
          onClick={handleConnectClick}
          disabled={!isTermsAccepted}
          available={true}
        />
      </div>
    </Modal>
  );
};
