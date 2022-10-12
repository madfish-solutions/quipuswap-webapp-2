import { FC, useContext } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { DOLLAR } from '@config/constants';
import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { StateCurrencyAmount } from '@shared/components';
import { getSymbolsString } from '@shared/helpers';
import { useTranslation } from '@translation';

import { Countdown } from '../countdown';
import { RewardInfo } from '../reward-info';
import { YouvesRewardHeader } from '../youves-reward-header';
import { YouvesStatsItem } from '../youves-stats-item';
import { useYouvesRewardInfoViewModel } from './use-youves-reward-info.vm';
import styles from './youves-reward-info.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

// TODO: Add tooltip (claimable / long term)

export const YouvesRewardInfo: FC = observer(() => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation();

  const {
    longTermPendingRewards,
    claimablePendingRewards,
    claimablePendingRewardsInUsd,
    shouldShowCountdown,
    shouldShowCountdownValue,
    timestamp,
    farmingLoading,
    rewardTokenDecimals,
    handleHarvest,
    isHarvestAvailable
  } = useYouvesRewardInfoViewModel();

  const symbolsString = getSymbolsString([QUIPU_TOKEN, TEZOS_TOKEN]);

  return (
    <RewardInfo
      claimablePendingRewards={claimablePendingRewards}
      longTermPendingRewards={longTermPendingRewards}
      dollarEquivalent={claimablePendingRewardsInUsd}
      amountDecimals={rewardTokenDecimals}
      className={cx(styles.rewardInfo, modeClass[colorThemeMode])}
      header={{
        content: <YouvesRewardHeader />,
        className: styles.rewardHeader
      }}
      onButtonClick={handleHarvest}
      buttonText={t('farm|Harvest')}
      rewardTooltip={t('farm|singleFarmRewardTooltip')}
      disabled={!isHarvestAvailable}
      currency={DOLLAR}
    >
      <YouvesStatsItem
        itemName={t('farm|Your Share')}
        loading={farmingLoading}
        tooltipContent={t('farm|yourShareTooltip')}
        data-test-id="yourShare"
      >
        <StateCurrencyAmount
          amount={1000}
          className={styles.statsValueText}
          currency={symbolsString}
          dollarEquivalent={100}
          labelSize="large"
        />
      </YouvesStatsItem>

      {shouldShowCountdown && (
        <YouvesStatsItem
          itemName={t('farm|Lock period ends in')}
          loading={false}
          tooltipContent={t('farm|feeEndsInTooltip')}
          data-test-id="lockPeriodEndsIn"
        >
          <Countdown shouldShow={shouldShowCountdownValue} endTimestamp={timestamp} />
        </YouvesStatsItem>
      )}
    </RewardInfo>
  );
});
