import { FC, ReactNode } from 'react';

import { BigNumber } from 'bignumber.js';

import { DOLLAR, USD_DECIMALS } from '@config/constants';
import { CardHeaderWithBackButton, DetailsCardCell, StateCurrencyAmount } from '@shared/components';
import { RewardInfo } from '@shared/structures';
import { Nullable } from '@shared/types';

import styles from './fees-list.module.scss';

interface TotalDepositInfo {
  totalDepositAmount: BigNumber;
  totalDepositLoading: boolean;
  totalDepositError: string | Error | null;
}

interface Props {
  claimablePendingRewards: Nullable<BigNumber>;
  onButtonClick: () => void;
  userTotalDepositInfo: TotalDepositInfo;
  isUserTotalDepositExist: boolean;
  translation: Record<string, string>;
  details: ReactNode;
  claimIsDisabled?: boolean;
  isRewardsError: boolean;
  backHref?: string;
}

export const FeesList: FC<Props> = ({
  claimablePendingRewards,
  onButtonClick,
  userTotalDepositInfo,
  isUserTotalDepositExist,
  translation,
  details,
  claimIsDisabled = false,
  isRewardsError,
  backHref
}) => {
  const {
    rewardsTooltipTranslation,
    backToTheListTranslation,
    claimFeeTranslation,
    totalFeesTranslation,
    totalDepositTranslation,
    totalDepositTooltipTranslation
  } = translation;
  const { totalDepositAmount, totalDepositLoading, totalDepositError } = userTotalDepositInfo;

  return (
    <RewardInfo
      containerClassName={styles.containerFeeInfo}
      userInfoContainerClassName={styles.userInfoContainer}
      childrenContainerClassName={styles.childrenFeeInfo}
      buttonContainerClassName={styles.buttonFeeInfo}
      viewDetailsButtonClassName={styles.viewDetailsButton}
      claimablePendingRewards={claimablePendingRewards}
      onButtonClick={onButtonClick}
      rewardTooltip={rewardsTooltipTranslation}
      buttonText={claimFeeTranslation}
      isError={isRewardsError}
      currency="$"
      buttonUp
      details={details}
      disabled={claimIsDisabled}
      rewardsLabel={totalFeesTranslation}
      header={
        backHref
          ? {
              content: <CardHeaderWithBackButton backHref={backHref} text={backToTheListTranslation} />,
              className: styles.rewardHeader
            }
          : undefined
      }
    >
      {isUserTotalDepositExist && (
        <DetailsCardCell
          className={styles.totalDeposit}
          cellNameClassName={styles.totalDepositCellName}
          cellName={totalDepositTranslation}
          tooltipContent={totalDepositTooltipTranslation}
          data-test-id="totalDeposit"
        >
          <StateCurrencyAmount
            amount={totalDepositAmount}
            amountDecimals={USD_DECIMALS}
            currency={DOLLAR}
            labelSize="large"
            isLoading={totalDepositLoading}
            isError={Boolean(totalDepositError)}
            isLeftCurrency
          />
        </DetailsCardCell>
      )}
    </RewardInfo>
  );
};
