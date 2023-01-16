import { FC, useContext } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';

// import { USD_DECIMALS } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { useAccountPkh } from '@providers/use-dapp';
import { StateCurrencyAmount } from '@shared/components';
import { GobletIcon } from '@shared/svg';
import { Nullable } from '@shared/types';
import { useTranslation } from '@translation';

import styles from './youves-pending-rewards.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props {
  claimablePendingRewards: Nullable<BigNumber>;
  longTermPendingRewards: Nullable<BigNumber>;
  claimableRewardDollarEquivalent?: Nullable<BigNumber.Value>;
  pendingRewardDollarEquivalent?: Nullable<BigNumber.Value>;
  claimableRewardsLoading: boolean;
  longTermRewardsLoading: boolean;
  currency: string;
  className?: string;
}

export const YouvesPendingRewards: FC<Props> = ({
  currency,
  claimableRewardDollarEquivalent,
  pendingRewardDollarEquivalent,
  claimablePendingRewards,
  longTermPendingRewards,
  claimableRewardsLoading,
  longTermRewardsLoading,
  className
}) => {
  const accountPkh = useAccountPkh();
  const { t } = useTranslation();
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.reward, modeClass[colorThemeMode], className)}>
      <div className={styles.container}>
        {accountPkh ? (
          <>
            <div className={styles.titleWrapper}>
              <span className={styles.title} data-test-id="rewardsNaming">
                {t('farm|Claimable')}
                <span className={styles.slash}>{'/'}</span>
                <p className={styles.fullRewards}>{t('farm|longTerm')}</p>
              </span>
            </div>
            <div className={styles.statesOfCurrencysAmount} data-test-id="rewardsValues">
              <StateCurrencyAmount
                className={styles.amount}
                amount={claimablePendingRewards}
                currency={currency}
                dollarEquivalent={claimableRewardDollarEquivalent}
                isLoading={claimableRewardsLoading}
                isLeftCurrency={currency === '$'}
                data-test-id="claimableRewards"
              />
              <div className={styles.bigSlash}>{'/'}</div>
              <StateCurrencyAmount
                className={styles.amount}
                amount={longTermPendingRewards}
                currency={currency}
                dollarEquivalent={pendingRewardDollarEquivalent}
                isLoading={longTermRewardsLoading}
                isLeftCurrency={currency === '$'}
                data-test-id="longTermRewards"
              />
            </div>
          </>
        ) : (
          <span className={styles.amount} data-test-id="earnExtraIncome">
            {t('farm|Earn extra income with QuipuSwap')}
          </span>
        )}
      </div>
      <GobletIcon />
    </div>
  );
};
