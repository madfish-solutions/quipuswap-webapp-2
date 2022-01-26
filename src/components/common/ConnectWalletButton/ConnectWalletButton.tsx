import React from 'react';

import { Button } from '@components/ui/elements/button';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import { useAccountPkh, useReady } from '@utils/dapp';
import { shortize } from '@utils/helpers';

interface ConnectWalletButtonProps {
  className?: string;
}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ className }) => {
  const ready = useReady();
  const accountPkh = useAccountPkh();
  const { openConnectWalletModal } = useConnectModalsState();
  const { openAccountInfoModal } = useConnectModalsState();

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
