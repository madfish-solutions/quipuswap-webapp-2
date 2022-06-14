import { FC, ReactNode } from 'react';

import { Button } from '@shared/components';
import { WalletType } from '@shared/types';

import styles from './wallet-modal.module.scss';

const TEMPLE_WALLET_LINK = 'https://templewallet.com/';

interface Props {
  className?: string;
  id: WalletType;
  Icon: FC<{ className?: string }>;
  label: ReactNode;
  onClick: (walletType: WalletType) => void;
  disabled?: boolean;
  available?: boolean;
}

export const WalletButton: FC<Props> = ({ id, Icon, label, onClick, disabled = false, available, ...props }) => {
  return (
    <Button
      className={styles.button}
      innerClassName={styles.buttonInner}
      textClassName={styles.buttonContent}
      theme="secondary"
      external
      href={!available ? TEMPLE_WALLET_LINK : undefined}
      onClick={() => {
        available && onClick(id);
      }}
      disabled={disabled}
      {...props}
    >
      <Icon className={styles.icon} />
      <span>{label}</span>
    </Button>
  );
};
