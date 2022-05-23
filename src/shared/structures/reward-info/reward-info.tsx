import { ReactNode } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';

import { Button, Card, ConnectWalletOrDoSomething, PendingRewards } from '@shared/components';
import { isNull } from '@shared/helpers';
import { ArrowSign } from '@shared/svg';
import { CFC, Nullable } from '@shared/types';

import styles from './reward-info.module.scss';
import { useRewardInfoViewModel } from './reward-info.vm';

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
  buttonUp?: boolean;
  details?: ReactNode;
}

const ZERO_REWARDS = 0;

export const RewardInfo: CFC<Props> = ({
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
  buttonUp,
  details,
  children
}) => {
  const { isDetailsOpen, toggle, transaction, showDetails } = useRewardInfoViewModel();
  const { detailsButtonTransaction } = transaction;

  const isButtonDisabled = isNull(claimablePendingRewards) || claimablePendingRewards.eq(ZERO_REWARDS) || disabled;

  const childrenContainerClassName = cx(styles.childrenContainer, {
    [styles.order2]: buttonUp
  });

  const buttonContainerClassName = cx(styles.buttonContainer, {
    [styles.order1]: buttonUp
  });

  const containerClassName = cx(styles.container, {
    [styles.pb0]: isDetailsOpen
  });

  return (
    <Card
      className={cx(styles.card, className)}
      contentClassName={styles.p0}
      header={header}
      footer={isDetailsOpen && details}
      data-test-id="farmingListPendingRewards"
    >
      <div className={containerClassName}>
        <PendingRewards
          className={styles.paddingRewards}
          claimablePendingRewards={claimablePendingRewards}
          totalPendingRewards={totalPendingRewards}
          dollarEquivalent={dollarEquivalent}
          amountDecimals={amountDecimals}
          currency={currency}
        />
        <div className={styles.userInfoContainer}>
          {children && <div className={childrenContainerClassName}>{children}</div>}
          <div className={buttonContainerClassName}>
            <ConnectWalletOrDoSomething>
              <Button
                data-test-id="rewardButtonAttribute"
                className={styles.button}
                onClick={onButtonClick}
                disabled={isButtonDisabled}
              >
                {buttonText}
              </Button>
            </ConnectWalletOrDoSomething>
          </div>

          {details && showDetails && (
            <Button
              className={cx(styles.order3, styles.viewDetailsButton)}
              theme="inverse"
              icon={<ArrowSign rotation={isDetailsOpen} />}
              onClick={toggle}
              data-test-id="rewardInfoHarvestAllButton"
            >
              {detailsButtonTransaction}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
