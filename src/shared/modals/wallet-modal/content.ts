import { FC } from 'react';

import { Beacon, Temple } from '../../svg';
import { WalletType } from '../../types/types';

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
