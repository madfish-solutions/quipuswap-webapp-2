import { FC, useContext } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { TZKT_EXPLORER_URL } from '@config/environment';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { StateCurrencyAmount } from '@shared/components';
import { getBakerName, getSymbolsString } from '@shared/helpers';
import { RewardInfo } from '@shared/structures';
import { useTranslation } from '@translation';

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
    endTime,
    myDepositDollarEquivalent,
    myReward,
    myRewardInUsd,
    rewardTokenDecimals,
    rewardTokenSymbol,
    farmingLoading,
    shouldShowCountdown,
    shouldShowCountdownValue,
    isHarvestAvailable,
    handleHarvest
  } = useFarmingRewardInfoViewModel();
  const symbolsString = getSymbolsString(farmingItem?.tokens ?? []);

  return (
    <RewardInfo
      claimablePendingRewards={myReward}
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
      currency={rewardTokenSymbol}
    >
      <FarmingStatsItem
        itemName={t('farm|Your Share')}
        loading={farmingLoading}
        tooltipContent={t('farm|yourShareTooltip')}
        data-test-id="yourShare"
      >
        {/* TODO: https://madfish.atlassian.net/browse/QUIPU-622 */}
        <StateData data={farmingItem} Fallback={RewardDashPlugFallback} isLoading={farmingLoading}>
          {({ depositBalance }) => (
            <StateCurrencyAmount
              amount={depositBalance}
              className={styles.statsValueText}
              currency={symbolsString}
              dollarEquivalent={myDepositDollarEquivalent}
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
          data-test-id="yourDelegate"
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
          data-test-id="lockPeriodEndsIn"
        >
          <StateData data={endTime} Fallback={RewardDashPlugFallback}>
            {timestamp => <Countdown shouldShow={shouldShowCountdownValue} endTimestamp={timestamp} />}
          </StateData>
        </FarmingStatsItem>
      )}
    </RewardInfo>
  );
});
