import React from 'react';
import { Beacon, Temple } from '@quipuswap/ui-kit';

import { WalletType } from '@utils/types';

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
