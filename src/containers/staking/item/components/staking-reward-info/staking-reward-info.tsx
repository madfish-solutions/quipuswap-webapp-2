import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';
import { noop } from 'rxjs';

import { RewardInfo } from '@components/common/reward-info';
import { ArrowDown } from '@components/svg/ArrowDown';
import { DashPlug } from '@components/ui/dash-plug';
import { Button } from '@components/ui/elements/button';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { Countdown } from '@containers/staking/item/components/countdown';
import { useStakingRewardInfoViewModel } from '@containers/staking/item/components/staking-reward-info/use-staking-reward-info.vm';
import { StakingStatsItem } from '@containers/staking/item/components/staking-stats-item';
import { defined, getBakerName, isNull } from '@utils/helpers';

import styles from './staking-reward-info.module.sass';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const StakingRewardInfo: FC = observer(() => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['stake']);
  const { stakeItem, myDelegate, delegatesLoading, endTimestamp, myEarnDollarEquivalent } =
    useStakingRewardInfoViewModel();

  return (
    <RewardInfo
      amount={myEarnDollarEquivalent ? new BigNumber(myEarnDollarEquivalent) : null}
      className={cx(styles.rewardInfo, modeClass[colorThemeMode])}
      header={{
        content: (
          <>
            <Button href="/staking" theme="quaternary" icon className={styles.arrowButton}>
              <ArrowDown className={styles.backArrow} />
            </Button>
            <span>Back to stakings</span>
          </>
        ),
        className: styles.rewardHeader
      }}
      onButtonClick={noop}
      buttonText="Harvest"
      currency="$"
    >
      <StakingStatsItem itemName={t('stake|Your Share')}>
        {stakeItem ? (
          <StateCurrencyAmount
            amount={stakeItem.earnBalance}
            className={styles.statsValueText}
            currency={stakeItem.rewardToken.metadata.symbol}
            dollarEquivalent={myEarnDollarEquivalent}
            amountDecimals={stakeItem.rewardToken.metadata.decimals}
            balanceRule
            labelSize="large"
          />
        ) : null}
      </StakingStatsItem>

      <StakingStatsItem itemName={t('stake|Your delegate')}>
        {isNull(myDelegate) ? (
          <DashPlug animation={delegatesLoading} className={styles.dashPlug} />
        ) : (
          <span className={cx(styles.delegate, styles.statsValueText)}>{getBakerName(myDelegate)}</span>
        )}
      </StakingStatsItem>

      <StakingStatsItem itemName={t('stake|Withdrawal fee ends in')}>
        {stakeItem ? <Countdown endTimestamp={defined(endTimestamp)} /> : null}
      </StakingStatsItem>
    </RewardInfo>
  );
});
