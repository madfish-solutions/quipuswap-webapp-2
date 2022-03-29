import React, { useCallback, useRef, useEffect } from 'react';

import { Button, Modal, shortize } from '@quipuswap/ui-kit';

import { useConnectModalsState } from '@providers/use-connect-modals-state';
import { useAccountPkh, useDisconnect } from '@providers/use-dapp';

import s from './AccountModal.module.sass';

const ADDRESS_LENGTH = 8;
const MS = 0;

export const AccountModal: React.FC = () => {
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
      contentClassName={s.modal}
      title="Account"
      isOpen={accountInfoModalOpen}
      onRequestClose={closeAccountInfoModal}
    >
      <div className={s.row}>
        <div className={s.addr} title={accountPkh}>
          {accountPkh && shortize(accountPkh, ADDRESS_LENGTH)}
        </div>
      </div>
      <Button className={s.button} theme="secondary" onClick={handleLogout}>
        Log Out
      </Button>
    </Modal>
  );
};
