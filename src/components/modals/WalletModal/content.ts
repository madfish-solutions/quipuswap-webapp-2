import React from 'react';

import { Beacon as BeaconIcon, Temple as TempleIcon } from '@quipuswap/ui-kit';

import { WalletType } from '@interfaces/types';

interface WalletProps {
  id: WalletType;
  Icon: React.FC<{ className?: string }>;
  label: string;
}

export const Temple: WalletProps = {
  id: WalletType.TEMPLE,
  Icon: TempleIcon,
  label: 'Temple Wallet'
};

export const Beacon: WalletProps = {
  id: WalletType.BEACON,
  Icon: BeaconIcon,
  label: 'Beacon'
};
