import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { DOLLAR } from '@config/constants';
import { useFarmingListRewardsStore } from '@modules/farming/hooks';
import { DetailsCardCell, StateCurrencyAmount } from '@shared/components';
import { RewardInfo } from '@shared/structures';
import { i18n } from '@translation';

import { RewardTokensList } from '../reward-tokens-list';
import styles from './farming-rewards-list.module.scss';
import { useFarmingRewardsListViewModel } from './use-farming-rewards-list.vm';

export const FarmingRewardsList: FC = observer(() => {
  const { claimablePendingRewardsInUsd, totalPendingRewardsInUsd } = useFarmingListRewardsStore();
  const { handleHarvestAll, translation, userTotalDepositInfo } = useFarmingRewardsListViewModel();
  const { rewardsTooltipTranslation, harvestAllTranslation } = translation;

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
      <DetailsCardCell
        className={styles.totalDeposit}
        cellName={i18n.t('farm|yourTotalDeposit')}
        data-test-id="yourTotalDeposit"
      >
        <StateCurrencyAmount
          amount={userTotalDepositInfo.totalDepositAmount}
          labelSize="large"
          currency={DOLLAR}
          isLoading={userTotalDepositInfo.totalDepositLoading}
          isError={Boolean(userTotalDepositInfo.totalDepositError)}
          isLeftCurrency
        />
      </DetailsCardCell>
    </RewardInfo>
  );
});
