import { FC, useCallback, useEffect, useState } from 'react';

import { AbortedBeaconError } from '@airgap/beacon-sdk';
import { NotGrantedTempleWalletError, TempleWallet } from '@temple-wallet/dapp';
import { useTranslation } from '@translation';

import { SAVED_TERMS_KEY } from '@config/config';
import { useConnectWithBeacon, useConnectWithTemple } from '@providers/use-dapp';
import { Button } from '@shared/components';
import { Checkbox } from '@shared/elements';
import { NoTempleWallet } from '@shared/errors';
import { useGlobalModalsState } from '@shared/hooks';
import { WalletType } from '@shared/types';
import { useToasts } from '@shared/utils';

import { Modal } from '../modal';
import { Beacon, Temple } from './content';
import { WalletButton } from './wallet-button';
import styles from './wallet-modal.module.scss';

const INSTALL_TEMPLE = 'Install Temple';

export const WalletModal: FC = () => {
  const { t } = useTranslation(['common']);
  const { showErrorToast } = useToasts();
  const [isTermsAccepted, setIsTermsAccepted] = useState(localStorage.getItem(SAVED_TERMS_KEY) === 'true' ?? false);

  const { connectWalletModalOpen, closeConnectWalletModal, openInstallTempleWalletModal } = useGlobalModalsState();
  const { closeAccountInfoModal } = useGlobalModalsState();
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
      containerClassName={styles.modalWrap}
      contentClassName={styles.modal}
      title={t('common|Connect wallet')}
      isOpen={connectWalletModalOpen}
      onRequestClose={closeConnectWalletModal}
    >
      <div className={styles.terms}>
        <div className={styles.def}>
          <Button
            control={<Checkbox checked={isTermsAccepted} />}
            onClick={handleCheck1}
            theme="quaternary"
            className={styles.btn}
          >
            <div className={styles.btnText}>{t('common|Accept terms')}</div>
          </Button>
          {t('common|I have read and agree to the')}{' '}
          <Button className={styles.defText} theme="underlined" href="/terms-of-service" external>
            {t('common|Terms of Usage')}
          </Button>{' '}
          {t('common|and')}{' '}
          <Button className={styles.defText} theme="underlined" href="/privacy-policy" external>
            {t('common|Privacy Policy')}
          </Button>
        </div>
      </div>
      <div className={styles.wallets}>
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
