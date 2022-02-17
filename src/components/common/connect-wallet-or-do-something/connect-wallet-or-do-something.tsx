import { FC } from 'react';

import cx from 'classnames';

import CC from '@styles/CommonContainer.module.sass';
import { useAccountPkh } from '@utils/dapp';

import { ConnectWalletButton } from '../ConnectWalletButton';

export const ConnectWalletOrDoSomething: FC = ({ children }) => {
  const accountPkh = useAccountPkh();

  if (accountPkh) {
    return <>{children}</>;
  }

  return <ConnectWalletButton className={cx(CC.connect, CC.button)} />;
};
