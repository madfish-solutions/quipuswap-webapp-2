import React from 'react';
import { Button } from '@madfish-solutions/quipu-ui-kit';

import { shortize } from '@utils/helpers';
import { useAccountPkh, useReady } from '@utils/dapp';
import { useConnectModalsState } from '@hooks/useConnectModalsState';

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
