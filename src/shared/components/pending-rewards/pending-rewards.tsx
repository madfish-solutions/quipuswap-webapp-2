import { FC, useContext } from 'react';

import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { USD_DECIMALS } from '@config/constants';
import { useFarmingListStore } from '@modules/farming/hooks';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { useAccountPkh } from '@providers/use-dapp';
import { GobletIcon } from '@shared/svg';
import { Nullable } from '@shared/types';
import { useTranslation } from '@translation';
import { DataTestAttribute } from 'tests/types';

import { StateCurrencyAmount } from '../state-components';
import styles from './pending-rewards.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props extends DataTestAttribute {
  claimablePendingRewards: Nullable<BigNumber>;
  totalPendingRewards?: Nullable<BigNumber>;
  dollarEquivalent?: Nullable<BigNumber.Value>;
  amountDecimals?: number;
  currency: string;
  claimableOnly?: boolean;
}

export const PendingRewards: FC<Props> = ({
  currency,
  testId,
  dollarEquivalent,
  claimableOnly,
  amountDecimals = USD_DECIMALS
}) => {
  const accountPkh = useAccountPkh();
  const { t } = useTranslation(['farm']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const farmingListStore = useFarmingListStore();
  const { claimablePendingRewards, totalPendingRewards } = farmingListStore;

  return (
    <div className={cx(styles.reward, modeClass[colorThemeMode])}>
      <div className={styles.container}>
        {accountPkh ? (
          <>
            <div className={styles.titleWrapper}>
              {claimableOnly ? (
                <span className={styles.title}>
                  {t('farm|Your Claimable')}
                  <span className={styles.slash}>{'/'}</span>
                  <p className={styles.fullRewards}>{t('farm|Your Full Rewards')}</p>
                </span>
              ) : (
                <span className={styles.title}>{t('farm|Your Full Rewards')}</span>
              )}
            </div>
            <div className={styles.statesOfCurrencysAmount}>
              {claimableOnly && (
                <>
                  <StateCurrencyAmount
                    className={styles.amount}
                    amount={claimablePendingRewards}
                    currency={currency}
                    dollarEquivalent={dollarEquivalent}
                    amountDecimals={amountDecimals}
                    isLeftCurrency={currency === '$'}
                    testId={testId}
                  />
                  <div className={styles.bigSlash}>{'/'}</div>
                </>
              )}
              <StateCurrencyAmount
                className={styles.amount}
                amount={totalPendingRewards}
                currency={currency}
                dollarEquivalent={dollarEquivalent}
                amountDecimals={amountDecimals}
                isLeftCurrency={currency === '$'}
                testId={testId}
              />
            </div>
          </>
        ) : (
          <span className={styles.amount}>{t('farm|Earn extra income with QuipuSwap')}</span>
        )}
      </div>
      <GobletIcon />
    </div>
  );
};
