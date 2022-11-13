import { ReactNode } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';

import { DOLLAR } from '@config/constants';
import {
  Button,
  Card,
  ConnectWalletOrDoSomething,
  DetailsCardCell,
  PendingRewards,
  StateCurrencyAmount
} from '@shared/components';
import { isNull } from '@shared/helpers';
import { ArrowSign } from '@shared/svg';
import { CFC, Nullable } from '@shared/types';
import { i18n } from '@translation';

import styles from './reward-info.module.scss';
import { useRewardInfoViewModel } from './use-reward-info.vm';

interface Props {
  claimablePendingRewards: Nullable<BigNumber>;
  totalPendingRewards?: Nullable<BigNumber>;
  dollarEquivalent?: Nullable<BigNumber.Value>;
  amountDecimals?: number;
  className?: string;
  containerClassName?: string;
  childrenContainerClassName?: string;
  userInfoContainerClassName?: string;
  buttonContainerClassName?: string;
  viewDetailsButtonClassName?: string;
  currency: string;
  userTotalDepositInfo: {
    totalDepositAmount: BigNumber;
    totalDepositLoading: boolean;
    totalDepositError: Nullable<string | Error>;
  };
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
  containerClassName,
  childrenContainerClassName,
  userInfoContainerClassName,
  buttonContainerClassName,
  viewDetailsButtonClassName,
  onButtonClick,
  currency,
  header,
  buttonText,
  disabled,
  claimablePendingRewards,
  totalPendingRewards,
  userTotalDepositInfo,
  buttonUp,
  details,
  children
}) => {
  const { isDetailsOpen, toggle, transaction, showDetails } = useRewardInfoViewModel();
  const { detailsButtonTransaction } = transaction;
  const { totalDepositAmount, totalDepositLoading, totalDepositError } = userTotalDepositInfo;

  const isUserTotalDepositExist = (!totalDepositAmount?.isZero() || totalDepositLoading) && !Boolean(totalDepositError);

  const isButtonDisabled = isNull(claimablePendingRewards) || claimablePendingRewards.eq(ZERO_REWARDS) || disabled;

  const wrapChildrenContainerClassName = cx(styles.childrenContainer, childrenContainerClassName, {
    [styles.order2]: buttonUp
  });

  const wrapUserInfoContainerClassName = cx(styles.userInfoContainer, userInfoContainerClassName);

  const wrapButtonContainerClassName = cx(styles.buttonContainer, buttonContainerClassName, {
    [styles.order1]: buttonUp
  });

  const wrapContainerClassName = cx(styles.container, containerClassName, {
    [styles.pb0]: isDetailsOpen && details
  });

  const wrapViewDetailsButtonrClassName = cx(styles.order3, styles.viewDetailsButton, viewDetailsButtonClassName);

  return (
    <Card
      className={cx(styles.card, className)}
      contentClassName={styles.p0}
      header={header}
      footer={isDetailsOpen && details}
      data-test-id="farmingListPendingRewards"
    >
      <div className={wrapContainerClassName}>
        <PendingRewards
          className={styles.paddingRewards}
          claimablePendingRewards={claimablePendingRewards}
          totalPendingRewards={totalPendingRewards}
          dollarEquivalent={dollarEquivalent}
          amountDecimals={amountDecimals}
          currency={currency}
        />
        <div className={styles.rightSide}>
          {/* TODO: Add tooltip content */}
          {isUserTotalDepositExist && (
            <DetailsCardCell
              className={styles.totalDeposit}
              cellName={i18n.t('farm|yourTotalDeposit')}
              data-test-id="yourTotalDeposit"
            >
              <StateCurrencyAmount
                amount={totalDepositAmount}
                labelSize="large"
                currency={DOLLAR}
                isLoading={totalDepositLoading}
                isLeftCurrency
              />
            </DetailsCardCell>
          )}
          <div className={wrapUserInfoContainerClassName}>
            {children && <div className={wrapChildrenContainerClassName}>{children}</div>}
            <div className={wrapButtonContainerClassName}>
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
                className={wrapViewDetailsButtonrClassName}
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
      </div>
    </Card>
  );
};
