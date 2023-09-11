import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { DOLLAR, USD_DECIMALS } from '@config/constants';
import { useRewards } from '@modules/farming/hooks';
import { DetailsCardCell, StateCurrencyAmount } from '@shared/components';
import { RewardInfo } from '@shared/structures';
import { i18n } from '@translation';

import styles from './farming-rewards-list.module.scss';
import { useFarmingRewardsListViewModel } from './use-farming-rewards-list.vm';
import { RewardTokensList } from '../reward-tokens-list';

export const FarmingRewardsList: FC = observer(() => {
  const { handleHarvestAll, translation, userTotalDepositInfo, isUserTotalDepositExist } =
    useFarmingRewardsListViewModel();
  const { claimablePendingRewardsInUsd, totalPendingRewardsInUsd } = useRewards();
  const { rewardsTooltipTranslation, harvestAllTranslation } = translation;
  const { totalDepositAmount, totalDepositLoading, totalDepositError } = userTotalDepositInfo;

  return (
    <RewardInfo
      containerClassName={styles.containerRewardInfo}
      userInfoContainerClassName={styles.userInfoContainer}
      childrenContainerClassName={styles.childrenRewardInfo}
      buttonContainerClassName={styles.buttonRewardInfo}
      viewDetailsButtonClassName={styles.viewDetailsButton}
      claimablePendingRewards={claimablePendingRewardsInUsd}
      totalPendingRewards={totalPendingRewardsInUsd}
      onButtonClick={handleHarvestAll}
      rewardTooltip={rewardsTooltipTranslation}
      buttonText={harvestAllTranslation}
      currency="$"
      buttonUp
      details={<RewardTokensList />}
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
