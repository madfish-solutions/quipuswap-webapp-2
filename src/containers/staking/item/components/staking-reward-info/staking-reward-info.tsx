import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';

import { TZKT_EXPLORER_URL } from '@app.config';
import { RewardInfo } from '@components/common/reward-info';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { getBakerName, getTokenSymbol } from '@utils/helpers';

import { Countdown } from '../countdown';
import { StakingRewardHeader } from '../staking-reward-header';
import { useStakingRewardInfoViewModel } from '../staking-reward-info/use-staking-reward-info.vm';
import { StakingStatsItem } from '../staking-stats-item';
import { StateData } from '../state-data';
import styles from './staking-reward-info.module.sass';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

const StakingFallback = () => null;

export const StakingRewardInfo: FC = observer(() => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['stake']);
  const {
    stakeItem,
    myDelegate,
    delegatesLoading,
    endTimestamp,
    myEarnDollarEquivalent,
    stakingLoading,
    handleHarvest
  } = useStakingRewardInfoViewModel();

  return (
    <RewardInfo
      amount={myEarnDollarEquivalent ? new BigNumber(myEarnDollarEquivalent) : null}
      className={cx(styles.rewardInfo, modeClass[colorThemeMode])}
      header={{
        content: <StakingRewardHeader />,
        className: styles.rewardHeader
      }}
      onButtonClick={handleHarvest}
      buttonText={t('stake|Harvest')}
      currency="$"
    >
      <StakingStatsItem itemName={t('stake|Your Share')} loading={stakingLoading}>
        <StateData data={stakeItem} Fallback={StakingFallback}>
          {({ earnBalance, rewardToken }) => (
            <StateCurrencyAmount
              amount={earnBalance}
              className={styles.statsValueText}
              currency={getTokenSymbol(rewardToken)}
              dollarEquivalent={myEarnDollarEquivalent}
              amountDecimals={rewardToken.metadata.decimals}
              labelSize="large"
            />
          )}
        </StateData>
      </StakingStatsItem>

      <StakingStatsItem itemName={t('stake|Your delegate')} loading={delegatesLoading}>
        <StateData data={myDelegate} Fallback={StakingFallback}>
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

      <StakingStatsItem itemName={t('stake|Withdrawal fee ends in')} loading={stakingLoading}>
        <StateData data={endTimestamp} Fallback={StakingFallback}>
          {timestamp => <Countdown endTimestamp={timestamp} />}
        </StateData>
      </StakingStatsItem>
    </RewardInfo>
  );
});
