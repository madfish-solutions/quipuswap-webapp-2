import { FC, useCallback, useRef, useEffect } from 'react';

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

import { Button } from '../../components';
import { amplitudeService } from '../../services';
import { Modal } from '../modal';
import styles from './reconnect-modal.module.scss';

const MS = 0;

export const ReconnectModal: FC = () => {
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
      contentClassName={styles.modal}
      title="Reconnection"
      isOpen={reconnectModalOpen}
      onRequestClose={handleRequestClose}
      data-test-id="reconnectWalletModal"
    >
      <div className={styles.row}>
        <div className={styles.text} title={accountPkh}>
          {t('common|reconnectionModalText', { currentRpcUrl, nextRpcUrl })}
        </div>
      </div>
      <Button className={styles.button} theme="secondary" onClick={handleReconnectClick} data-test-id="buttonReconnect">
        {t('common|Reconnect')}
      </Button>
    </Modal>
  );
};
