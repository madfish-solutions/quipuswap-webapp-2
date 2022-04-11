import { FC, ReactNode } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';

import { Button, Card, ConnectWalletOrDoSomething, PendingRewards } from '@shared/components';
import { ClaimableRewards } from '@shared/components/claimable_rewards';
import { isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

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
  claimableOnly?: boolean;
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
  claimableOnly,
  children
}) => {
  const isButtonDisabled = isNull(amount) || amount.eq(ZERO_REWARDS) || disabled;

  return (
    <Card className={cx(styles.card, className)} header={header}>
      <div className={styles.container}>
        {claimableOnly ? (
          <ClaimableRewards
            testId={pendingRewardAttributeTestId}
            amount={amount}
            dollarEquivalent={dollarEquivalent}
            amountDecimals={amountDecimals}
            currency={currency}
            tooltip={rewardTooltip}
          />
        ) : (
          <PendingRewards
            testId={pendingRewardAttributeTestId}
            amount={amount}
            dollarEquivalent={dollarEquivalent}
            amountDecimals={amountDecimals}
            currency={currency}
            tooltip={rewardTooltip}
          />
        )}
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
