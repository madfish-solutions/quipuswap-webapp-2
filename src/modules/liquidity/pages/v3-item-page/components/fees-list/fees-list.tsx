import { FC, ReactNode } from 'react';

import { BigNumber } from 'bignumber.js';
import { observer } from 'mobx-react-lite';

import { DOLLAR, USD_DECIMALS } from '@config/constants';
import { DetailsCardCell, StateCurrencyAmount } from '@shared/components';
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
}

export const FeesList: FC<Props> = observer(
  ({ claimablePendingRewards, onButtonClick, userTotalDepositInfo, isUserTotalDepositExist, translation, details }) => {
    const { rewardsTooltipTranslation, harvestAllTranslation, totalFeesTranslation, totalDepositTranslation } =
      translation;
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
        buttonText={harvestAllTranslation}
        currency="$"
        buttonUp
        details={details}
        rewardsLabel={totalFeesTranslation}
      >
        {isUserTotalDepositExist && (
          <DetailsCardCell
            className={styles.totalDeposit}
            cellNameClassName={styles.totalDepositCellName}
            cellName={totalDepositTranslation}
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
  }
);
