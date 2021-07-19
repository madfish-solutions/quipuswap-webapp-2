import React from 'react';

import { WalletType } from '@utils/types';
import Temple from '@icons/Temple.svg';
import Beacon from '@icons/Beacon.svg';

type WalletsProps = {
  id: WalletType
  Icon: React.FC<{ className?: string }>
  label: string
}[];

export const Wallets: WalletsProps = [
  {
    id: WalletType.TEMPLE,
    Icon: Temple,
    label: 'Temple Wallet',
  },
  {
    id: WalletType.BEACON,
    Icon: Beacon,
    label: 'Beacon',
  },
];
