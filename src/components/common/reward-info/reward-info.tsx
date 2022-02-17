import { FC, ReactNode } from 'react';

import BigNumber from 'bignumber.js';

import { Card } from '@components/ui/card';
import { Button } from '@components/ui/elements/button';

import { ConnectWalletOrDoSomething } from '../connect-wallet-or-do-something';
import { PendingRewards } from '../pending-rewards';
import styles from './reward-info.module.scss';

interface Props {
  amount: BigNumber;
  currency: string;
  onButtonClick: () => void;
  buttonText: string;
  header?: {
    content: ReactNode;
    button?: ReactNode;
    className?: string;
  };
}

export const RewardInfo: FC<Props> = ({ amount, onButtonClick, currency, header, buttonText, children }) => {
  return (
    <Card className={styles.card} header={header}>
      <div className={styles.container}>
        <PendingRewards amount={amount} currency={currency} />
        <div className={styles.userInfoContainer}>
          <div className={styles.childrenContainer}>{children}</div>
          <ConnectWalletOrDoSomething>
            <Button className={styles.button} onClick={onButtonClick}>
              {buttonText}
            </Button>
          </ConnectWalletOrDoSomething>
        </div>
      </div>
    </Card>
  );
};
