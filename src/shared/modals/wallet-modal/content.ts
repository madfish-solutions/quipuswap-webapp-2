import { FC } from 'react';

import { Beacon } from '@shared/svg/beacon';
import { Temple } from '@shared/svg/temple';
import { WalletType } from '@shared/types/types';

interface WalletProps {
  id: WalletType;
  Icon: FC<{ className?: string }>;
  label: string;
}

export const Wallets: WalletProps[] = [
  {
    id: WalletType.TEMPLE,
    Icon: Temple,
    label: 'Temple Wallet'
  },
  {
    id: WalletType.BEACON,
    Icon: Beacon,
    label: 'Beacon'
  }
];
