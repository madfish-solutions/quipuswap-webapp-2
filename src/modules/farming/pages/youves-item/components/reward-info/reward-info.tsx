import { ReactNode } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';

import { Button, Card, ConnectWalletOrDoSomething } from '@shared/components';
import { isNull } from '@shared/helpers';
import { CFC, Nullable } from '@shared/types';

import { YouvesPendingRewards } from '../youves-pending-rewards';
import styles from './reward-info.module.scss';

interface Props {
  claimablePendingRewards: Nullable<BigNumber>;
  longTermPendingRewards: Nullable<BigNumber>;
  claimableRewardDollarEquivalent?: Nullable<BigNumber.Value>;
  pendingRewardDollarEquivalent?: Nullable<BigNumber.Value>;
  claimableRewardsLoading: boolean;
  longTermRewardsLoading: boolean;
  amountDecimals?: number;
  className?: string;
  containerClassName?: string;
  childrenContainerClassName?: string;
  userInfoContainerClassName?: string;
  buttonContainerClassName?: string;
  viewDetailsButtonClassName?: string;
  currency: string;
  onButtonClick: () => void;
  buttonText: string;
  header?: {
    content: ReactNode;
    button?: ReactNode;
    className?: string;
  };
  footer?: ReactNode;
  footerClassName?: string;
  rewardTooltip?: string;
  disabled?: boolean;
  buttonUp?: boolean;
}

const ZERO_REWARDS = 0;

export const RewardInfo: CFC<Props> = ({
  claimableRewardDollarEquivalent,
  pendingRewardDollarEquivalent,
  claimableRewardsLoading,
  longTermRewardsLoading,
  amountDecimals,
  className,
  containerClassName,
  childrenContainerClassName,
  userInfoContainerClassName,
  buttonContainerClassName,
  onButtonClick,
  currency,
  header,
  footer,
  footerClassName,
  buttonText,
  disabled,
  claimablePendingRewards,
  longTermPendingRewards,
  buttonUp,
  children
}) => {
  const isButtonDisabled = isNull(claimablePendingRewards) || claimablePendingRewards.eq(ZERO_REWARDS) || disabled;

  const wrapChildrenContainerClassName = cx(styles.childrenContainer, childrenContainerClassName, {
    [styles.order2]: buttonUp
  });

  const wrapUserInfoContainerClassName = cx(styles.userInfoContainer, userInfoContainerClassName);

  const wrapButtonContainerClassName = cx(styles.buttonContainer, buttonContainerClassName, {
    [styles.order1]: buttonUp
  });

  const wrapContainerClassName = cx(styles.container, containerClassName);

  return (
    <Card
      className={cx(styles.card, className)}
      contentClassName={styles.p0}
      header={header}
      footer={footer}
      footerClassName={footerClassName}
      data-test-id="youvesRewardInfo"
    >
      <div className={wrapContainerClassName}>
        <YouvesPendingRewards
          className={styles.paddingRewards}
          claimablePendingRewards={claimablePendingRewards}
          longTermPendingRewards={longTermPendingRewards}
          claimableRewardsLoading={claimableRewardsLoading}
          longTermRewardsLoading={longTermRewardsLoading}
          claimableRewardDollarEquivalent={claimableRewardDollarEquivalent}
          pendingRewardDollarEquivalent={pendingRewardDollarEquivalent}
          amountDecimals={amountDecimals}
          currency={currency}
        />
        <div className={wrapUserInfoContainerClassName}>
          {children && <div className={wrapChildrenContainerClassName}>{children}</div>}
          <div className={wrapButtonContainerClassName}>
            <ConnectWalletOrDoSomething>
              <Button
                data-test-id="youvesRewardButton"
                className={styles.button}
                onClick={onButtonClick}
                disabled={isButtonDisabled}
              >
                {buttonText}
              </Button>
            </ConnectWalletOrDoSomething>
          </div>
        </div>
      </div>
    </Card>
  );
};
