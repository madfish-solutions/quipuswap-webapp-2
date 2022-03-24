import React, { useCallback, useRef, useEffect } from 'react';

import { Button, Modal, shortize } from '@quipuswap/ui-kit';


import s from './AccountModal.module.sass';
import { useConnectModalsState } from '../../../providers/use-connect-modals-state';
import { useAccountPkh, useDisconnect } from '../../../providers/use-dapp';

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
