import { FC, ReactNode } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';

import { Button, Card, ConnectWalletOrDoSomething, PendingRewards } from '@shared/components';
import { isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

import styles from './reward-info.module.scss';

interface Props {
  claimablePendingRewards: Nullable<BigNumber>;
  totalPendingRewards?: Nullable<BigNumber>;
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
}

const ZERO_REWARDS = 0;

export const RewardInfo: FC<Props> = ({
  dollarEquivalent,
  amountDecimals,
  className,
  onButtonClick,
  currency,
  header,
  buttonText,
  disabled,
  claimablePendingRewards,
  totalPendingRewards,
  children
}) => {
  const isButtonDisabled = isNull(claimablePendingRewards) || claimablePendingRewards.eq(ZERO_REWARDS) || disabled;

  return (
    <Card className={cx(styles.card, className)} header={header} data-test-id="farmingListPendingRewards">
      <div className={styles.container}>
        <PendingRewards
          claimablePendingRewards={claimablePendingRewards}
          totalPendingRewards={totalPendingRewards}
          dollarEquivalent={dollarEquivalent}
          amountDecimals={amountDecimals}
          currency={currency}
        />
        <div className={styles.userInfoContainer}>
          {children && <div className={styles.childrenContainer}>{children}</div>}
          <ConnectWalletOrDoSomething>
            <Button
              data-test-id="rewardInfoHarvestAllButton"
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
