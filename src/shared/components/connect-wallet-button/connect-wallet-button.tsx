import React from 'react';

import { Button } from '../button';
import { useGlobalModalsState } from '../../hooks/use-global-modals-state';
import { useAccountPkh, useReady } from '../../../providers/use-dapp';
import { shortize } from '../../helpers/shortize';

interface ConnectWalletButtonProps {
  className?: string;
}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ className }) => {
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
