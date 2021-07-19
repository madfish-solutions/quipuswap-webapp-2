import React from 'react';
import { useTranslation } from 'next-i18next';

import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { Beacon } from '@components/svg/Beacon';
import { Temple } from '@components/svg/Temple';

import s from './WalletModal.module.sass';

export const WalletModal: React.FC<ReactModal.Props> = ({
  ...props
}) => {
  const { t } = useTranslation(['common']);

  return (
    <Modal
      containerClassName={s.modalWrap}
      contentClassName={s.modal}
      title={t('common:Connect wallet')}
      {...props}
    >
      <Button
        className={s.button}
        theme="secondary"
      >
        <div className={s.buttonContent}>
          <Temple className={s.icon} />
          Temple wallet
        </div>
      </Button>
      <Button
        className={s.button}
        theme="secondary"
      >
        <div className={s.buttonContent}>
          <Beacon className={s.icon} />
          Another wallet
        </div>
      </Button>
    </Modal>
  );
};
