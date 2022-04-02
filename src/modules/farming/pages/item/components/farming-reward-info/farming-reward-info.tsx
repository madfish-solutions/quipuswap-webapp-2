import { FC, useContext } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { TZKT_EXPLORER_URL } from '@config/config';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { StateCurrencyAmount } from '@shared/components';
import { getBakerName, getTokenSymbol } from '@shared/helpers';
import { useTranslation } from '@shared/hooks';
import { RewardInfo } from '@shared/structures';
import { FarmingItemPandingReward } from '@tests/farming';

import { Countdown } from '../countdown';
import { FarmingRewardHeader } from '../farming-reward-header';
import { FarmingStatsItem } from '../farming-stats-item';
import { RewardDashPlugFallback } from '../reward-dash-plug-fallback';
import { StateData } from '../state-data';
import styles from './farming-reward-info.module.scss';
import { useFarmingRewardInfoViewModel } from './use-farming-reward-info.vm';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const FarmingRewardInfo: FC = observer(() => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['farm']);
  const {
    shouldShowCandidate,
    farmingItem,
    myDelegate,
    delegatesLoading,
    endTimestamp,
    myDepositDollarEquivalent,
    myRewardInTokens,
    myRewardInUsd,
    rewardTokenDecimals,
    rewardTokenSymbol,
    farmingLoading,
    shouldShowCountdown,
    shouldShowCountdownValue,
    isHarvestAvailable,
    handleHarvest
  } = useFarmingRewardInfoViewModel();

  return (
    <RewardInfo
      amount={myRewardInTokens}
      dollarEquivalent={myRewardInUsd}
      amountDecimals={rewardTokenDecimals}
      className={cx(styles.rewardInfo, modeClass[colorThemeMode])}
      header={{
        content: <FarmingRewardHeader />,
        className: styles.rewardHeader
      }}
      onButtonClick={handleHarvest}
      buttonText={t('farm|Harvest')}
      rewardTooltip={t('farm|singleFarmRewardTooltip')}
      disabled={!isHarvestAvailable}
      rewardButtonAttributeTestId={FarmingItemPandingReward.HARVEST_BUTTON}
      pendingRewardAttributeTestId={FarmingItemPandingReward.PENDING_REWARD}
      currency={rewardTokenSymbol}
    >
      <FarmingStatsItem
        itemName={t('farm|Your Share')}
        loading={farmingLoading}
        tooltipContent={t('farm|yourShareTooltip')}
      >
        <StateData data={farmingItem} Fallback={RewardDashPlugFallback} isLoading={farmingLoading}>
          {({ depositBalance, stakedToken }) => (
            <StateCurrencyAmount
              amount={depositBalance}
              className={styles.statsValueText}
              currency={getTokenSymbol(stakedToken)}
              dollarEquivalent={myDepositDollarEquivalent}
              amountDecimals={stakedToken.metadata.decimals}
              labelSize="large"
            />
          )}
        </StateData>
      </FarmingStatsItem>

      {shouldShowCandidate && (
        <FarmingStatsItem
          itemName={t('farm|Your delegate')}
          loading={delegatesLoading}
          tooltipContent={t('farm|yourDelegateTooltip')}
        >
          <StateData data={myDelegate} Fallback={RewardDashPlugFallback} isLoading={delegatesLoading}>
            {delegate => (
              <a
                href={`${TZKT_EXPLORER_URL}/${delegate.address}`}
                target="_blank"
                rel="noreferrer noopener"
                className={cx(styles.delegate, styles.statsValueText)}
              >
                {getBakerName(delegate)}
              </a>
            )}
          </StateData>
        </FarmingStatsItem>
      )}

      {shouldShowCountdown && (
        <FarmingStatsItem
          itemName={t('farm|Lock period ends in')}
          loading={farmingLoading}
          tooltipContent={t('farm|feeEndsInTooltip')}
        >
          <StateData data={endTimestamp} Fallback={RewardDashPlugFallback}>
            {timestamp => <Countdown shouldShow={shouldShowCountdownValue} endTimestamp={timestamp} />}
          </StateData>
        </FarmingStatsItem>
      )}
    </RewardInfo>
  );
});
