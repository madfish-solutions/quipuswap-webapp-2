import { observer } from 'mobx-react-lite';

import { DOLLAR } from '@config/constants';
import { DEFAULT_TOKEN } from '@config/tokens';
import { FarmingStatsItem } from '@modules/farming/pages/item/components/farming-stats-item';
import { StateCurrencyAmount } from '@shared/components';
import { getTokenSymbol, isNull } from '@shared/helpers';
import { RewardInfo } from '@shared/structures';

import { StableFarmRewardDetails } from '../stablefarm-reward-details';
import styles from './stablefarm-reward-info.module.scss';
import { useStableFarmRewardInfoViewModel } from './use-stablefarm-reward-info.vm';

export const StableFarmRewardInfo = observer(() => {
  const {
    claimablePendingRewards,
    harvest,
    buttonText,
    rewardTooltip,
    rawData,
    showDetails,
    shares,
    sharesDollarEquivalent,
    yourShareName,
    yourShareTooltip
  } = useStableFarmRewardInfoViewModel();

  return (
    <RewardInfo
      containerClassName={styles.containerRewardInfo}
      userInfoContainerClassName={styles.userInfoContainer}
      childrenContainerClassName={styles.childrenRewardInfo}
      buttonContainerClassName={styles.buttonRewardInfo}
      viewDetailsButtonClassName={styles.viewDetailsButton}
      claimablePendingRewards={claimablePendingRewards}
      currency={DOLLAR}
      onButtonClick={harvest}
      rewardTooltip={rewardTooltip}
      buttonText={buttonText}
      buttonUp
      details={showDetails && <StableFarmRewardDetails rawData={rawData} />}
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
