import { shortize } from '../helpers/shortize';
import { useConnectModalsState } from '../../providers/use-connect-modals-state';
import { useAccountPkh, useReady } from '../../providers/use-dapp';
import { FC } from 'react';

interface ConnectWalletButtonProps {
  className?: string;
}

export const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({ className }) => {
  const ready = useReady();
  const accountPkh = useAccountPkh();
  const { openConnectWalletModal } = useConnectModalsState();
  const { openAccountInfoModal } = useConnectModalsState();

  if (ready && accountPkh) {
    return (
      <button className={className} onClick={openAccountInfoModal} title={accountPkh}>
        {accountPkh ? shortize(accountPkh, 7) : 'Connect wallet'}
      </button>
    );
  }

  return (
    <button className={className} onClick={openConnectWalletModal}>
      Connect wallet
    </button>
  );
};
