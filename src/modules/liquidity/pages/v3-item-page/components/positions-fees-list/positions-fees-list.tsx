import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { DOLLAR, USD_DECIMALS } from '@config/constants';
import { DetailsCardCell, StateCurrencyAmount } from '@shared/components';
import { RewardInfo } from '@shared/structures';
import { i18n } from '@translation';

import { FeeTokensList } from '../fee-tokens-list';
import styles from './positions-fees-list.module.scss';
import { usePositionsFeesListViewModel } from './use-positions-fees-list.vm';

export const PositionsFeesList: FC = observer(() => {
  const { claimablePendingRewardsInUsd, handleClaimAll, translation, userTotalDepositInfo, isUserTotalDepositExist } =
    usePositionsFeesListViewModel();
  const { rewardsTooltipTranslation, harvestAllTranslation } = translation;
  const { totalDepositAmount, totalDepositLoading, totalDepositError } = userTotalDepositInfo;

  return (
    <RewardInfo
      containerClassName={styles.containerFeeInfo}
      userInfoContainerClassName={styles.userInfoContainer}
      childrenContainerClassName={styles.childrenFeeInfo}
      buttonContainerClassName={styles.buttonFeeInfo}
      viewDetailsButtonClassName={styles.viewDetailsButton}
      claimablePendingRewards={claimablePendingRewardsInUsd}
      onButtonClick={handleClaimAll}
      rewardTooltip={rewardsTooltipTranslation}
      buttonText={harvestAllTranslation}
      currency="$"
      buttonUp
      details={<FeeTokensList />}
    >
      {isUserTotalDepositExist && (
        <DetailsCardCell
          className={styles.totalDeposit}
          cellNameClassName={styles.totalDepositCellName}
          cellName={i18n.t('farm|yourTotalDeposit')}
          data-test-id="yourTotalDeposit"
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
});
