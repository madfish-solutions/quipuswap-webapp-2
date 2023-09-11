import { FC, useCallback, useRef, useEffect, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import {
  useAccountPkh,
  useCurrentRpcUrl,
  useNextRpcUrl,
  useReconnect,
  useRejectReconnection,
  useShouldReconnect
} from '@providers/use-dapp';
import { useGlobalModalsState } from '@providers/use-global-modals-state';
import { useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import styles from './reconnect-modal.module.scss';
import { Button } from '../../components';
import { amplitudeService } from '../../services';
import { Modal } from '../modal';

const MS = 0;

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const ReconnectModal: FC = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation();
  const accountPkh = useAccountPkh();
  const reconnect = useReconnect();
  const rejectReconnection = useRejectReconnection();
  const currentRpcUrl = useCurrentRpcUrl();
  const nextRpcUrl = useNextRpcUrl();
  const shouldReconnect = useShouldReconnect();
  const { showErrorToast } = useToasts();

  const { reconnectModalOpen, openReconnectModal, closeReconnectModal } = useGlobalModalsState();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const timeout = useRef(setTimeout(() => {}, MS));

  const handleReconnectClick = useCallback(async () => {
    closeReconnectModal();
    try {
      await reconnect();
    } catch (err) {
      showErrorToast(err as Error);
    }
    amplitudeService.logEvent('LOGOUT_CLICK');
  }, [reconnect, closeReconnectModal, showErrorToast]);

  const handleRequestClose = useCallback(() => {
    rejectReconnection();
    closeReconnectModal();
  }, [rejectReconnection, closeReconnectModal]);

  useEffect(
    () => () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    },
    []
  );

  useEffect(() => {
    if (shouldReconnect && !reconnectModalOpen && accountPkh) {
      openReconnectModal();
    } else if (shouldReconnect && !reconnectModalOpen) {
      reconnect().catch(e => showErrorToast(e as Error));
    } else if (!shouldReconnect && reconnectModalOpen) {
      closeReconnectModal();
    }
  }, [
    shouldReconnect,
    openReconnectModal,
    closeReconnectModal,
    reconnectModalOpen,
    accountPkh,
    reconnect,
    showErrorToast
  ]);

  if (!accountPkh) {
    return <></>;
  }

  return (
    <Modal
      containerClassName={styles.container}
      contentClassName={cx(styles.modal, modeClass[colorThemeMode])}
      title="Reconnection"
      isOpen={reconnectModalOpen}
      onRequestClose={handleRequestClose}
      data-test-id="reconnectWalletModal"
    >
      <div className={styles.text}>{t('common|reconnectionModalText', { currentRpcUrl, nextRpcUrl })}</div>
      <Button className={styles.button} theme="secondary" onClick={handleReconnectClick} data-test-id="buttonReconnect">
        {t('common|Reconnect')}
      </Button>
    </Modal>
  );
};
