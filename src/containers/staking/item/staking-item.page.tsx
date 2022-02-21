import { FC, useContext, useMemo } from 'react';

import { ColorModes, ColorThemeContext, StickyBlock } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { noop } from 'rxjs';

import { MS_IN_SECOND } from '@app.config';
import { PageTitle } from '@components/common/page-title';
import { RewardInfo } from '@components/common/reward-info';
import { ArrowDown } from '@components/svg/ArrowDown';
import { DashPlug } from '@components/ui/dash-plug';
import { Button } from '@components/ui/elements/button';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { StakingTabsCard } from '@containers/staking/item/components/staking-form/staking-tabs-card';
import { useStakeItemPageViewModel } from '@containers/staking/item/use-stake-item-page.vm';
import { useBakers } from '@utils/dapp';
import {
  isUndefined,
  getDollarEquivalent,
  bigNumberToString,
  isBackerNotEmpty,
  shortize,
  isNull
} from '@utils/helpers';

import { Countdown } from './components/countdown';
import { StakingDetails } from './components/staking-details';
import { StakingStatsItem } from './components/staking-stats-item';
import { getRewardTokenSymbol } from './helpers/get-reward-token-symbol';
import styles from './staking-item.page.module.sass';

const DEFAULT_EARN_EXCHANGE_RATE = new BigNumber(0);
const endTimestamp = Date.now() + 90069 * MS_IN_SECOND;

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const StakingItemPage: FC = observer(() => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['stake']);
  const router = useRouter();
  const { data: bakers, loading: bakersLoading } = useBakers();
  const { isLoading, stakeItem, getTitle } = useStakeItemPageViewModel();

  const myEarnDollarEquivalent = getDollarEquivalent(
    stakeItem?.earnBalance,
    bigNumberToString(stakeItem?.earnExchangeRate ?? DEFAULT_EARN_EXCHANGE_RATE)
  );
  const rewardTokenSymbol = stakeItem && getRewardTokenSymbol(stakeItem);

  if (!isLoading && isUndefined(stakeItem)) {
    void router.replace('/404');

    return null;
  }

  const delegateLoading = bakersLoading || !stakeItem;
  const mockDelegate = delegateLoading ? null : bakers[0];
  const delegateName = useMemo(() => {
    if (!mockDelegate) {
      return null;
    }

    return isBackerNotEmpty(mockDelegate) ? mockDelegate.name : shortize(mockDelegate.address);
  }, [mockDelegate]);

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
              currency={rewardTokenSymbol}
              dollarEquivalent={myEarnDollarEquivalent}
              amountDecimals={stakeItem.rewardToken.metadata.decimals}
              balanceRule
              labelSize="large"
            />
          ) : null}
        </StakingStatsItem>

        <StakingStatsItem itemName={t('stake|Your delegate')}>
          {isNull(delegateName) ? (
            <DashPlug animation={delegateLoading} className={styles.dashPlug} />
          ) : (
            <span className={cx(styles.delegate, styles.statsValueText)}>{delegateName}</span>
          )}
        </StakingStatsItem>

        <StakingStatsItem itemName={t('stake|Withdrawal fee ends in')}>
          {stakeItem ? <Countdown endTimestamp={endTimestamp} /> : null}
        </StakingStatsItem>
      </RewardInfo>

      <StickyBlock>
        <StakingTabsCard />
        <StakingDetails item={stakeItem} isError={!isLoading && !stakeItem} />
      </StickyBlock>
    </>
  );
});
