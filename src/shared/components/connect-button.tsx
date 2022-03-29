import { FC } from 'react';

import { useConnectModalsState } from '../../providers/use-connect-modals-state';
import { useAccountPkh, useReady } from '../../providers/use-dapp';
import { shortize } from '../helpers/shortize';

interface ConnectWalletButtonProps {
  className?: string;
}

const DEFAULT_LENGTH = 7;

export const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({ className }) => {
  const ready = useReady();
  const accountPkh = useAccountPkh();
  const { openConnectWalletModal } = useConnectModalsState();
  const { openAccountInfoModal } = useConnectModalsState();

  if (ready && accountPkh) {
    return (
      <button className={className} onClick={openAccountInfoModal} title={accountPkh}>
        {accountPkh ? shortize(accountPkh, DEFAULT_LENGTH) : 'Connect wallet'}
      </button>
    );
  }

  return (
    <button className={className} onClick={openConnectWalletModal}>
      Connect wallet
    </button>
  );
};
