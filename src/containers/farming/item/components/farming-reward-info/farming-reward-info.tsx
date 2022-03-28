import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';

import { TZKT_EXPLORER_URL } from '@app.config';
import { RewardInfo } from '@components/common/reward-info';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { getBakerName, getTokenSymbol } from '@utils/helpers';

import { Countdown } from '../countdown';
import { FarmingRewardHeader } from '../farming-reward-header';
import { FarmingStatsItem } from '../farming-stats-item';
import { RewardDashPlugFallback } from '../reward-dash-plug-fallback';
import { StateData } from '../state-data';
import { FarmingItemPendingReward } from './farming-item-pending-reward';
import styles from './farming-reward-info.module.sass';
import { useFarmingRewardInfoViewModel } from './use-farming-reward-info.vm';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

const NO_TIMELOCK_VALUE = '0';

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
    timelock,
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
      rewardButtonAttributeTestId={FarmingItemPendingReward.HARVEST_BUTTON}
      pendingRewardAttributeTestId={FarmingItemPendingReward.PENDING_REWARD}
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

      {timelock !== NO_TIMELOCK_VALUE && (
        <FarmingStatsItem
          itemName={t('farm|Withdrawal fee ends in')}
          loading={farmingLoading}
          tooltipContent={t('farm|feeEndsInTooltip')}
        >
          <StateData data={endTimestamp} Fallback={RewardDashPlugFallback}>
            {timestamp => <Countdown endTimestamp={timestamp} />}
          </StateData>
        </FarmingStatsItem>
      )}
    </RewardInfo>
  );
});
