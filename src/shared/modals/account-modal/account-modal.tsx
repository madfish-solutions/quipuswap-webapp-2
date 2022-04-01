import { FC, useCallback, useRef, useEffect } from 'react';

import { useConnectModalsState } from '@providers/use-connect-modals-state';
import { useAccountPkh, useDisconnect } from '@providers/use-dapp';

import { Button } from '../../components/button';
import { shortize } from '../../helpers';
import { Modal } from '../modal';
import styles from './account-modal.module.scss';

const ADDRESS_LENGTH = 8;
const MS = 0;

export const AccountModal: FC = () => {
  const accountPkh = useAccountPkh();
  const disconnect = useDisconnect();

  const { accountInfoModalOpen, closeAccountInfoModal } = useConnectModalsState();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const timeout = useRef(setTimeout(() => {}, MS));

  const handleLogout = useCallback(() => {
    disconnect();
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
      </div>
      <Button className={styles.button} theme="secondary" onClick={handleLogout}>
        Log Out
      </Button>
    </Modal>
  );
};
