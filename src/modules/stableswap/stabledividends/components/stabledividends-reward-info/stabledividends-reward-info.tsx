import { observer } from 'mobx-react-lite';

import { DOLLAR } from '@config/constants';
import { DEFAULT_TOKEN } from '@config/tokens';
import { FarmingStatsItem } from '@modules/farming/pages/item/components/farming-stats-item';
import { StateCurrencyAmount } from '@shared/components';
import { getTokenSymbol, isNull } from '@shared/helpers';
import { RewardInfo } from '@shared/structures';

import { StableDividendsRewardDetails } from '../stabledividends-reward-details';
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
      <FarmingStatsItem
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
      </FarmingStatsItem>
    </RewardInfo>
  );
});
