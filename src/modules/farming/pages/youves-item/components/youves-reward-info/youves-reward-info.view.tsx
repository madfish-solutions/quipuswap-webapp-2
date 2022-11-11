import { FC, useContext } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { StateCurrencyAmount } from '@shared/components';
import { Nullable } from '@shared/types';
import { useTranslation } from '@translation';

import { Countdown } from '../countdown';
import { NextRewardsTimer } from '../next-rewards-timer';
import { RewardInfo } from '../reward-info';
import { YouvesRewardHeader } from '../youves-reward-header';
import { YouvesStatsItem } from '../youves-stats-item';
import styles from './youves-reward-info.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

// TODO: Add tooltip (claimable / long term)

interface Props {
  isBlocked: boolean;
  claimablePendingRewards: Nullable<BigNumber>;
  longTermPendingRewards: Nullable<BigNumber>;
  claimablePendingRewardsInUsd: Nullable<BigNumber>;
  longTermPendingRewardsInUsd: Nullable<BigNumber>;
  claimableRewardsLoading: boolean;
  longTermRewardsLoading: boolean;
  shouldShowCountdown: boolean;
  shouldShowCountdownValue: boolean;
  rewadsDueDate: number;
  farmingLoading: boolean;
  rewardTokenDecimals: number;
  handleHarvest: () => void;
  isHarvestAvailable: boolean;
  symbolsString: string;
  rewardTokenCurrency: string;
  userTotalDeposit: BigNumber;
  userTotalDepositDollarEquivalent: BigNumber;
}

export const YouvesRewardInfoView: FC<Props> = observer(
  ({
    isBlocked,
    longTermPendingRewards,
    longTermPendingRewardsInUsd,
    claimablePendingRewards,
    claimablePendingRewardsInUsd,
    claimableRewardsLoading,
    longTermRewardsLoading,
    shouldShowCountdown,
    shouldShowCountdownValue,
    rewadsDueDate,
    farmingLoading,
    rewardTokenDecimals,
    handleHarvest,
    isHarvestAvailable,
    symbolsString,
    rewardTokenCurrency,
    userTotalDeposit,
    userTotalDepositDollarEquivalent
  }) => {
    const { colorThemeMode } = useContext(ColorThemeContext);
    const { t } = useTranslation();

    return (
      <RewardInfo
        claimablePendingRewards={claimablePendingRewards}
        longTermPendingRewards={longTermPendingRewards}
        claimableRewardDollarEquivalent={claimablePendingRewardsInUsd}
        pendingRewardDollarEquivalent={longTermPendingRewardsInUsd}
        claimableRewardsLoading={claimableRewardsLoading}
        longTermRewardsLoading={longTermRewardsLoading}
        amountDecimals={rewardTokenDecimals}
        className={cx(styles.rewardInfo, modeClass[colorThemeMode])}
        header={{
          content: <YouvesRewardHeader />,
          className: styles.rewardHeader
        }}
        footer={<NextRewardsTimer />}
        footerClassName={styles.footer}
        onButtonClick={handleHarvest}
        buttonText={t('farm|Harvest')}
        rewardTooltip={t('farm|singleFarmRewardTooltip')}
        disabled={!isHarvestAvailable}
        currency={rewardTokenCurrency}
      >
        {/* TODO: https://madfish.atlassian.net/browse/QUIPU-636 */}
        {isBlocked && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              color: 'rgba(255, 255, 0, 0.8)',
              paddingLeft: 8
            }}
          >
            <p>
              Oops. This farm doesn't generate yield. You are welcome to use{' '}
              <Link to="/farming/v3/0" style={{ textDecoration: 'underline' }}>
                this one
              </Link>{' '}
              🤗
            </p>
          </div>
        )}
        <YouvesStatsItem
          itemName={t('farm|Your Share')}
          loading={farmingLoading}
          tooltipContent={t('farm|yourShareTooltip')}
          data-test-id="yourShare"
        >
          <StateCurrencyAmount
            amount={userTotalDeposit}
            className={styles.statsValueText}
            currency={symbolsString}
            dollarEquivalent={userTotalDepositDollarEquivalent}
            labelSize="large"
          />
        </YouvesStatsItem>

        {shouldShowCountdown && (
          <YouvesStatsItem
            itemName={t('farm|Vesting period ends in')}
            loading={false}
            tooltipContent={t('farm|vestingPeriodIndsInTooltip')}
            data-test-id="lockPeriodEndsIn"
          >
            <Countdown shouldShow={shouldShowCountdownValue} endTimestamp={rewadsDueDate} />
          </YouvesStatsItem>
        )}
      </RewardInfo>
    );
  }
);
