import React from 'react';

import { Beacon, Temple } from '@quipuswap/ui-kit';
import { WalletType } from '../../../types/typesNew';


interface WalletProps {
  id: WalletType;
  Icon: React.FC<{ className?: string }>;
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
