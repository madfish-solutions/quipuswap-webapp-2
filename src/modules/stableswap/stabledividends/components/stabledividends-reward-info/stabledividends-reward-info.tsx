import { observer } from 'mobx-react-lite';

import { DOLLAR } from '@config/constants';
import { DEFAULT_TOKEN } from '@config/tokens';
import { StateCurrencyAmount } from '@shared/components';
import { getTokenSymbol, isNull } from '@shared/helpers';
import { RewardInfo } from '@shared/structures';

import { StableDividendsRewardDetails } from '../stabledividends-reward-details';
import { StableDividendsStatsItem } from '../stabledividends-stats-item';
import styles from './stabledividends-reward-info.module.scss';
import { useStableDividendsRewardInfoViewModel } from './use-stabledividends-reward-info.vm';

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
          currency={getTokenSymbol(DEFAULT_TOKEN)}
          dollarEquivalent={sharesDollarEquivalent}
          labelSize="large"
        />
      </StableDividendsStatsItem>
    </RewardInfo>
  );
});
