import { FC, ReactNode } from 'react';

import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { Card } from '@components/ui/card';
import { Button } from '@components/ui/elements/button';
import { isNull } from '@utils/helpers';
import { Nullable } from '@utils/types';

import { ConnectWalletOrDoSomething } from '../connect-wallet-or-do-something';
import { PendingRewards } from '../pending-rewards';
import styles from './reward-info.module.scss';

interface Props {
  amount: Nullable<BigNumber>;
  dollarEquivalent?: Nullable<BigNumber.Value>;
  amountDecimals?: number;
  className?: string;
  currency: string;
  onButtonClick: () => void;
  buttonText: string;
  header?: {
    content: ReactNode;
    button?: ReactNode;
    className?: string;
  };
  rewardTooltip?: string;
  disabled?: boolean;
  rewardButtonAttributeTestId: string;
  pendingRewardAttributeTestId: string;
}

const ZERO_REWARDS = 0;

export const RewardInfo: FC<Props> = ({
  amount,
  dollarEquivalent,
  amountDecimals,
  className,
  onButtonClick,
  currency,
  header,
  rewardTooltip,
  buttonText,
  disabled,
  rewardButtonAttributeTestId,
  pendingRewardAttributeTestId,
  children
}) => {
  const isButtonDisabled = isNull(amount) || amount.eq(ZERO_REWARDS) || disabled;

  return (
    <Card className={cx(styles.card, className)} header={header}>
      <div className={styles.container}>
        <PendingRewards
          testId={pendingRewardAttributeTestId}
          amount={amount}
          dollarEquivalent={dollarEquivalent}
          amountDecimals={amountDecimals}
          currency={currency}
          tooltip={rewardTooltip}
        />
        <div className={styles.userInfoContainer}>
          {children && <div className={styles.childrenContainer}>{children}</div>}
          <ConnectWalletOrDoSomething>
            <Button
              testId={rewardButtonAttributeTestId}
              className={styles.button}
              onClick={onButtonClick}
              disabled={isButtonDisabled}
            >
              {buttonText}
            </Button>
          </ConnectWalletOrDoSomething>
        </div>
      </div>
    </Card>
  );
};
