import { FC, useCallback, useEffect, useState } from 'react';

import { AbortedBeaconError } from '@airgap/beacon-sdk';
import { NotGrantedTempleWalletError, TempleWallet } from '@temple-wallet/dapp';

import { SAVED_TERMS_KEY } from '@config/localstorage';
import { useConnectWithBeacon, useConnectWithTemple } from '@providers/use-dapp';
import { useGlobalModalsState } from '@providers/use-global-modals-state';
import { Button } from '@shared/components';
import { Checkbox } from '@shared/elements';
import { NoTempleWallet } from '@shared/errors';
import { useMobileDetect } from '@shared/hooks';
import { WalletType } from '@shared/types';
import { useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { Beacon, Temple } from './content';
import { TempleWalletButton } from './temple-wallet-button';
import { WalletButton } from './wallet-button';
import styles from './wallet-modal.module.scss';
import { amplitudeService } from '../../services';
import { Modal } from '../modal';

export const WalletModal: FC = () => {
  const { isMobile } = useMobileDetect();
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
        amplitudeService.logEvent('CONNECT_WALLET_SUCCESS', { walletType });
        amplitudeService.setUserProps('wallet_type', walletType);
      } catch (err) {
        if (err instanceof NoTempleWallet) {
          openInstallTempleWalletModal();
          amplitudeService.logEvent('CONNECT_WALLET_FAILED', { reason: 'NO_TEMPLE_WALLET', err });

          return;
        }
        const authenticationWasRejected =
          err instanceof NotGrantedTempleWalletError || err instanceof AbortedBeaconError;
        if (!authenticationWasRejected) {
          const errorMessage = t(
            'common|errorWhileConnectingWallet'
            // { check what this message sholud do
            //   walletName: walletType === WalletType.BEACON ? 'Beacon' : 'Temple Wallet',
            //   error: (err as Error).message
            // }
          );

          showErrorToast(errorMessage);
          amplitudeService.logEvent('CONNECT_WALLET_FAILED', { reason: 'NOT_GRANTED', err });

          return;
        }
        amplitudeService.logEvent('CONNECT_WALLET_FAILED', { reason: 'OTHER', err });
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
      data-test-id="connectWalletModal"
    >
      <div className={styles.terms}>
        <div className={styles.def}>
          <Button
            control={<Checkbox checked={isTermsAccepted} />}
            onClick={handleCheck1}
            theme="quaternary"
            className={styles.btn}
            data-test-id="checkButton"
          >
            <div className={styles.btnText}>{t('common|Accept terms')}</div>
          </Button>
          {t('common|I have read and agree to the')}{' '}
          <Button
            className={styles.defText}
            theme="underlined"
            href="/terms-of-service"
            data-test-id="termsOfUsage"
            external
          >
            {t('common|Terms of Usage')}
          </Button>{' '}
          {t('common|and')}{' '}
          <Button
            className={styles.defText}
            theme="underlined"
            href="/privacy-policy"
            data-test-id="privacyPolicy"
            external
          >
            {t('common|Privacy Policy')}
          </Button>
        </div>
      </div>
      <div className={styles.wallets}>
        <TempleWalletButton
          available={isTempleInstalled}
          id={Temple.id}
          Icon={Temple.Icon}
          label={
            isTempleInstalled ? (
              Temple.label
            ) : (
              <>
                {Temple.label}
                <br /> extension
              </>
            )
          }
          onClick={handleConnectClick}
          disabled={!isTermsAccepted}
          data-test-id="templeWalletButton"
        />
        <WalletButton
          id={Beacon.id}
          Icon={Beacon.Icon}
          label={isMobile ? t('common|chooseYourWallet') : Beacon.label}
          onClick={handleConnectClick}
          disabled={!isTermsAccepted}
          available={true}
          data-test-id="beaconWalletButton"
        />
      </div>
    </Modal>
  );
};
