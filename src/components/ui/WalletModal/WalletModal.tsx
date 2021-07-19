import React from 'react';
import { useTranslation } from 'next-i18next';

import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';

import Beacon from '@icons/Beacon.svg';
import Temple from '@icons/Temple.svg';

import s from './WalletModal.module.sass';

type ModalProps = {
  isShow?: boolean
  setShow?: (state:boolean) => void
} & ReactModal.Props;

export const WalletModal: React.FC<ModalProps> = ({
  isShow = false,
  setShow = () => {},
}) => {
  const { t } = useTranslation(['common']);

  return (
    <Modal
      containerClassName={s.modalWrap}
      contentClassName={s.modal}
      isOpen={isShow}
      onRequestClose={() => setShow(false)}
      title={t('common:Connect wallet')}
    >
      <Button
        className={s.button}
        theme="secondary"
      >
        <div className={s.buttonContent}>
          <Temple />
          Temple wallet
        </div>
      </Button>
      <Button
        className={s.button}
        theme="secondary"
      >
        <div className={s.buttonContent}>
          <Beacon />
          Another wallet
        </div>
      </Button>
    </Modal>
  );
};
