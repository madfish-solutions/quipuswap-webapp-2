import { FC } from 'react';

<<<<<<< HEAD
import { useConnectModalsState, useAccountPkh, useReady } from '@providers';

import { shortize } from '../helpers/shortize';
=======
import { useConnectModalsState } from '@providers/use-connect-modals-state';
import { useAccountPkh, useReady } from '@providers/use-dapp';
import { shortize } from '@shared/helpers/shortize';
>>>>>>> e43c04a620c4298264fa08dfd7ae85b82d8f1c07

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
