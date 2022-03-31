import { FC } from 'react';

import { useAccountPkh, useReady } from '@providers/use-dapp';

import { shortize } from '../../helpers';
import { useGlobalModalsState } from '../../hooks';
import { Button } from '../button';

interface ConnectWalletButtonProps {
  className?: string;
}

export const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({ className }) => {
  const ready = useReady();
  const accountPkh = useAccountPkh();
  const { openConnectWalletModal } = useGlobalModalsState();
  const { openAccountInfoModal } = useGlobalModalsState();

  if (ready && accountPkh) {
    return (
      <Button className={className} onClick={openAccountInfoModal} title={accountPkh}>
        {shortize(accountPkh)}
      </Button>
    );
  }

  return (
    <Button className={className} onClick={openConnectWalletModal}>
      Connect wallet
    </Button>
  );
};
