import { observer } from 'mobx-react-lite';

import { DOLLAR } from '@config/constants';
import { QUIPU_TOKEN } from '@config/tokens';
import { StateCurrencyAmount } from '@shared/components';
import { getTokenSymbol, isNull } from '@shared/helpers';
import { RewardInfo } from '@shared/structures';

import styles from './stabledividends-reward-info.module.scss';
import { useStableDividendsRewardInfoViewModel } from './use-stabledividends-reward-info.vm';
import { StableDividendsRewardDetails } from '../stabledividends-reward-details';
import { StableDividendsStatsItem } from '../stabledividends-stats-item';

export const StableDividendsRewardInfo = observer(() => {
  const {
    claimablePendingRewards,
    hadleHarvest,
    buttonText,
    rewardTooltip,
    rawData,
    showDetails,
    shares,
    sharesDollarEquivalent,
    yourShareName,
    yourShareTooltip
  } = useStableDividendsRewardInfoViewModel();

  return (
    <RewardInfo
      containerClassName={styles.containerRewardInfo}
      userInfoContainerClassName={styles.userInfoContainer}
      childrenContainerClassName={styles.childrenRewardInfo}
      buttonContainerClassName={styles.buttonRewardInfo}
      viewDetailsButtonClassName={styles.viewDetailsButton}
      claimablePendingRewards={claimablePendingRewards}
      currency={DOLLAR}
      onButtonClick={hadleHarvest}
      rewardTooltip={rewardTooltip}
      buttonText={buttonText}
      buttonUp
      details={showDetails && <StableDividendsRewardDetails rawData={rawData} />}
    >
      <StableDividendsStatsItem
        itemName={yourShareName}
        loading={isNull(shares)}
        tooltipContent={yourShareTooltip}
        data-test-id="yourShare"
      >
        <StateCurrencyAmount
          amount={shares}
          className={styles.statsValueText}
          currency={getTokenSymbol(QUIPU_TOKEN)}
          dollarEquivalent={sharesDollarEquivalent}
          labelSize="large"
        />
      </StableDividendsStatsItem>
    </RewardInfo>
  );
});
