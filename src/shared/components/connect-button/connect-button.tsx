import { FC } from 'react';

import { useConnectModalsState, useAccountPkh, useReady } from '@providers';

import { shortize } from '../../helpers';

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
