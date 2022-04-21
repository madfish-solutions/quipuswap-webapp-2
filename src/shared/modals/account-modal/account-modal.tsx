import { FC, useCallback, useRef, useEffect, useState } from 'react';

import { useAccountPkh, useDisconnect } from '@providers/use-dapp';
import { useGlobalModalsState } from '@providers/use-global-modals-state';
import { CheckMark, Copy } from '@shared/svg';

import { Button } from '../../components';
import { shortize } from '../../helpers';
import { amplitudeService } from '../../services';
import { Modal } from '../modal';
import styles from './account-modal.module.scss';

const ADDRESS_LENGTH = 8;
const MS = 0;

export const AccountModal: FC = () => {
  const accountPkh = useAccountPkh();
  const disconnect = useDisconnect();
  const [copied, setCopied] = useState<boolean>(false);

  const { accountInfoModalOpen, closeAccountInfoModal } = useGlobalModalsState();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const timeout = useRef(setTimeout(() => {}, MS));

  const handleLogout = useCallback(() => {
    disconnect();
    amplitudeService.logEvent('LOGOUT_CLICK');
  }, [disconnect]);

  useEffect(
    () => () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    },
    []
  );

  if (!accountPkh) {
    return <></>;
  }

  const handleCopy = async () => {
    navigator.clipboard.writeText(accountPkh);
    setCopied(true);
    amplitudeService.logEvent('COPY_PK_ADDRESS_CLICK');
    timeout.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Modal
      contentClassName={styles.modal}
      title="Account"
      isOpen={accountInfoModalOpen}
      onRequestClose={closeAccountInfoModal}
    >
      <div className={styles.row}>
        <div className={styles.addr} title={accountPkh}>
          {accountPkh && shortize(accountPkh, ADDRESS_LENGTH)}
        </div>
        <Button
          onClick={handleCopy}
          theme="inverse"
          className={styles.buttonCopy}
          control={copied ? <CheckMark className={styles.icon} /> : <Copy className={styles.icon} />}
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <Button className={styles.button} theme="secondary" onClick={handleLogout}>
        Log Out
      </Button>
    </Modal>
  );
};
