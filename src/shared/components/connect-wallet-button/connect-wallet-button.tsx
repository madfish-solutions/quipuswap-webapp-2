import { FC } from 'react';

import { useAccountPkh, useReady } from '@providers/use-dapp';
import { useGlobalModalsState } from '@providers/use-global-modals-state';

import { shortize } from '../../helpers';
import { Button } from '../button';

interface ConnectWalletButtonProps {
  testId?: string;
  className?: string;
}

export const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({ testId, className }) => {
  const ready = useReady();
  const accountPkh = useAccountPkh();
  const { openConnectWalletModal } = useGlobalModalsState();
  const { openAccountInfoModal } = useGlobalModalsState();

  if (ready && accountPkh) {
    return (
      <Button className={className} onClick={openAccountInfoModal} title={accountPkh} testId={testId}>
        {shortize(accountPkh)}
      </Button>
    );
  }

  return (
    <Button className={className} onClick={openConnectWalletModal} testId={testId}>
      Connect wallet
    </Button>
  );
};
