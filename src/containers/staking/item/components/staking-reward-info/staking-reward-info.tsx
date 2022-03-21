import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';

import { TZKT_EXPLORER_URL } from '@app.config';
import { RewardInfo } from '@components/common/reward-info';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { StakeItemPandingReward } from '@tests/staking/item';
import { getBakerName, getTokenSymbol } from '@utils/helpers';

import { Countdown } from '../countdown';
import { RewardDashPlugFallback } from '../reward-dash-plug-fallback';
import { StakingRewardHeader } from '../staking-reward-header';
import { useStakingRewardInfoViewModel } from '../staking-reward-info/use-staking-reward-info.vm';
import { StakingStatsItem } from '../staking-stats-item';
import { StateData } from '../state-data';
import styles from './staking-reward-info.module.sass';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

const NO_TIMELOCK_VALUE = '0';

export const StakingRewardInfo: FC = observer(() => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['farm']);
  const {
    shouldShowCandidate,
    stakeItem,
    myDelegate,
    delegatesLoading,
    endTimestamp,
    myDepositDollarEquivalent,
    myRewardInTokens,
    rewardTokenDecimals,
    rewardTokenSymbol,
    stakingLoading,
    timelock,
    handleHarvest
  } = useStakingRewardInfoViewModel();

  return (
    <RewardInfo
      amount={myRewardInTokens}
      amountDecimals={rewardTokenDecimals}
      className={cx(styles.rewardInfo, modeClass[colorThemeMode])}
      header={{
        content: <StakingRewardHeader />,
        className: styles.rewardHeader
      }}
      onButtonClick={handleHarvest}
      buttonText={t('farm|Harvest')}
      rewardTooltip={t('farm|singleFarmRewardTooltip')}
      rewardButtonAttributeTestId={StakeItemPandingReward.HARVEST_BUTTON}
      pendingRewardAttributeTestId={StakeItemPandingReward.PENDING_REWARD}
      currency={rewardTokenSymbol}
    >
      <StakingStatsItem
        itemName={t('farm|Your Share')}
        loading={stakingLoading}
        tooltipContent={t('farm|yourShareTooltip')}
      >
        <StateData data={stakeItem} Fallback={RewardDashPlugFallback} isLoading={stakingLoading}>
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
      </StakingStatsItem>

      {shouldShowCandidate && (
        <StakingStatsItem
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
        </StakingStatsItem>
      )}

      {timelock !== NO_TIMELOCK_VALUE && (
        <StakingStatsItem
          itemName={t('farm|Withdrawal fee ends in')}
          loading={stakingLoading}
          tooltipContent={t('farm|feeEndsInTooltip')}
        >
          <StateData data={endTimestamp} Fallback={RewardDashPlugFallback}>
            {timestamp => <Countdown endTimestamp={timestamp} />}
          </StateData>
        </StakingStatsItem>
      )}
    </RewardInfo>
  );
});
