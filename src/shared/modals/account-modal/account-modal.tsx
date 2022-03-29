import React, { useCallback, useRef, useEffect } from 'react';

import { Button, Modal, shortize } from '@quipuswap/ui-kit';


import s from './account-modal.module.sass';
import { useConnectModalsState, useAccountPkh, useDisconnect } from '@providers';

export const AccountModal: React.FC = () => {
  const accountPkh = useAccountPkh();
  const disconnect = useDisconnect();

  const { accountInfoModalOpen, closeAccountInfoModal } = useConnectModalsState();
  const timeout = useRef(setTimeout(() => {}, 0));

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
          {accountPkh && shortize(accountPkh, 8)}
        </div>
      </div>
      <Button className={s.button} theme="secondary" onClick={handleLogout}>
        Log Out
      </Button>
    </Modal>
  );
};
