import cx from 'classnames';

import { useAccountPkh } from '@providers/use-dapp';
import { CFC } from '@shared/types';
import CC from '@styles/CommonContainer.module.scss';

import { ConnectWalletButton } from '../connect-wallet-button';

export const ConnectWalletOrDoSomething: CFC = ({ children }) => {
  const accountPkh = useAccountPkh();

  if (accountPkh) {
    return <>{children}</>;
  }

  return <ConnectWalletButton className={cx(CC.connect, CC.button)} />;
};
