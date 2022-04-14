import { FC } from 'react';

import { useAccountPkh, useReady } from '@providers/use-dapp';
import { useGlobalModalsState } from '@providers/use-global-modals-state';

import { shortize } from '../../helpers';
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
      <Button className={className} onClick={openAccountInfoModal} title={accountPkh} testId="sButtonConnected">
        {shortize(accountPkh)}
      </Button>
    );
  }

  return (
    <Button className={className} onClick={openConnectWalletModal} testId="sConnectButton">
      Connect wallet
    </Button>
  );
};
