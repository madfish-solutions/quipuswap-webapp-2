import { FC } from 'react';

import { useAccountPkh, useReady } from '@providers/use-dapp';
import { useGlobalModalsState } from '@providers/use-global-modals-state';

import { shortize } from '../../helpers';
import { amplitudeService } from '../../services';
import { Button } from '../button';

interface ConnectWalletButtonProps {
  className?: string;
}

export const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({ className }) => {
  const ready = useReady();
  const accountPkh = useAccountPkh();
  const { openConnectWalletModal, openAccountInfoModal } = useGlobalModalsState();

  if (ready && accountPkh) {
    const handleDisconnectWallet = () => {
      openAccountInfoModal();
      amplitudeService.logEvent('DISCONNECT_WALLET_CLICK');
    };

    return (
      <Button className={className} onClick={handleDisconnectWallet} title={accountPkh}>
        {shortize(accountPkh)}
      </Button>
    );
  }

  const handleConnectWallet = () => {
    amplitudeService.logEvent('CONNECT_WALLET_CLICK');
    openConnectWalletModal();
  };

  return (
    <Button className={className} onClick={handleConnectWallet}>
      Connect wallet
    </Button>
  );
};
