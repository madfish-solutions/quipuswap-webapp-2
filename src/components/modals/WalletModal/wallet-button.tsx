import React, { FC } from 'react';

import s from '@components/modals/WalletModal/WalletModal.module.sass';
import { Button } from '@components/ui/elements/button';
import { WalletType } from '@interfaces/types';

const TEMPLE_WALLET_LINK = 'https://templewallet.com/';

interface Props {
  className?: string;
  id: WalletType;
  Icon: FC<{ className?: string }>;
  label: string;
  onClick: (walletType: WalletType) => void;
  disabled?: boolean;
  available?: boolean;
}

export const WalletButton: FC<Props> = ({ id, Icon, label, onClick, disabled = false, available }) => {
  return (
    <Button
      className={s.button}
      innerClassName={s.buttonInner}
      textClassName={s.buttonContent}
      theme="secondary"
      external
      href={!available ? TEMPLE_WALLET_LINK : undefined}
      onClick={() => {
        available && onClick(id);
      }}
      disabled={disabled}
    >
      <Icon className={s.icon} />
      <span>{label}</span>
    </Button>
  );
};
