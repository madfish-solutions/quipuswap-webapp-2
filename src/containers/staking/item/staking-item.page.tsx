import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext, StickyBlock } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { noop } from 'rxjs';

import { PageTitle } from '@components/common/page-title';
import { RewardInfo } from '@components/common/reward-info';
import { ArrowDown } from '@components/svg/ArrowDown';
import { DashPlug } from '@components/ui/dash-plug';
import { Button } from '@components/ui/elements/button';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { StakingTabsCard } from '@containers/staking/item/components/staking-form/staking-tabs-card';
import { useStakeItemPageViewModel } from '@containers/staking/item/use-stake-item-page.vm';
import { isUndefined, getDollarEquivalent, bigNumberToString, isNull, defined, getBakerName } from '@utils/helpers';

import { Countdown } from './components/countdown';
import { StakingDetails } from './components/staking-details';
import { StakingStatsItem } from './components/staking-stats-item';
import styles from './staking-item.page.module.sass';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

const DEFAULT_EARN_EXCHANGE_RATE = new BigNumber('0');

export const StakingItemPage: FC = observer(() => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['stake']);
  const router = useRouter();
  const { isLoading, stakeItem, getTitle, myDelegate, delegatesLoading, endTimestamp } = useStakeItemPageViewModel();

  const myEarnDollarEquivalent = getDollarEquivalent(
    stakeItem?.earnBalance,
    bigNumberToString(stakeItem?.earnExchangeRate ?? DEFAULT_EARN_EXCHANGE_RATE)
  );

  if (!isLoading && isUndefined(stakeItem)) {
    void router.replace('/404');

    return null;
  }

  return (
    <>
      <PageTitle>{getTitle()}</PageTitle>

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

      <StickyBlock>
        <StakingTabsCard />
        <StakingDetails isError={!isLoading && !stakeItem} />
      </StickyBlock>
    </>
  );
});
