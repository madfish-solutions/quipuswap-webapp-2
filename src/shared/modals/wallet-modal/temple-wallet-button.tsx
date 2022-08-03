import { FC } from 'react';

import { useMobileDetect } from '@shared/hooks';

import { WalletButton, WalletButtonProps } from './wallet-button';

export const TempleWalletButton: FC<WalletButtonProps> = props => {
  const { isMobile } = useMobileDetect();

  if (isMobile) {
    return null;
  }

  return <WalletButton {...props} />;
};
