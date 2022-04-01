import { FC } from 'react';

import cx from 'classnames';

import { useAccountPkh } from '@providers/use-dapp';
import CC from '@styles/CommonContainer.module.scss';

import { ConnectWalletButton } from '../connect-wallet-button';

export const ConnectWalletOrDoSomething: FC = ({ children }) => {
  const accountPkh = useAccountPkh();

  if (accountPkh) {
    return <>{children}</>;
  }

  return <ConnectWalletButton className={cx(CC.connect, CC.button)} />;
};
