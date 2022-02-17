import { FC, ReactNode, useState } from 'react';

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

const ZERO_REWARDS = 0;

export const RewardInfo: FC<Props> = ({ amount, onButtonClick, currency, header, buttonText, children }) => {
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 1500);

  const isButtonDisabled = amount.eq(ZERO_REWARDS);

  return (
    <Card className={styles.card} header={header}>
      <div className={styles.container}>
        <PendingRewards amount={amount} currency={currency} />
        <div className={styles.userInfoContainer}>
          {children && <div className={styles.childrenContainer}>{children}</div>}
          <ConnectWalletOrDoSomething>
            <Button className={styles.button} onClick={onButtonClick} disabled={isButtonDisabled} loading={loading}>
              {buttonText}
            </Button>
          </ConnectWalletOrDoSomething>
        </div>
      </div>
    </Card>
  );
};
