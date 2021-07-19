import React from 'react';

import { shortize } from '@utils/helpers';
import { useAccountPkh, useReady } from '@utils/dapp';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import { Button } from '@components/ui/Button';

type ConnectWalletButtonProps = {
  className?: string
};

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
  className,
}) => {
  const ready = useReady();
  const accountPkh = useAccountPkh();
  const { openConnectWalletModal } = useConnectModalsState();
  const { openAccountInfoModal } = useConnectModalsState();

  if (ready && accountPkh) {
    return (
      <Button
        className={className}
        onClick={openAccountInfoModal}
        title={accountPkh}
      >
        {shortize(accountPkh, 7)}
      </Button>
    );
  }

  return (
    <Button
      className={className}
      onClick={openConnectWalletModal}
    >
      Connect wallet
    </Button>
  );
};
