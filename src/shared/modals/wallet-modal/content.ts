import { FC } from 'react';

import { Beacon as BeaconIcon, Temple as TempleIcon } from '@shared/svg';
import { WalletType } from '@shared/types';

interface WalletProps {
  id: WalletType;
  Icon: FC<{ className?: string }>;
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
