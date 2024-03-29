import { FC, ReactNode, useContext } from 'react';

import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { USD_DECIMALS } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { useAccountPkh } from '@providers/use-dapp';
import { isExist } from '@shared/helpers';
import { GobletIcon } from '@shared/svg';
import { Nullable } from '@shared/types';
import { useTranslation } from '@translation';

import styles from './pending-rewards.module.scss';
import { StateCurrencyAmount } from '../state-components';
import { Tooltip } from '../tooltip';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props {
  claimablePendingRewards: Nullable<BigNumber>;
  totalPendingRewards?: Nullable<BigNumber>;
  dollarEquivalent?: Nullable<BigNumber.Value>;
  amountDecimals?: number;
  currency: string;
  isError?: boolean;
  className?: string;
  rewardsLabel?: string;
  rewardTooltip?: ReactNode;
}

export const PendingRewards: FC<Props> = ({
  currency,
  dollarEquivalent,
  amountDecimals = USD_DECIMALS,
  claimablePendingRewards,
  totalPendingRewards,
  className,
  isError,
  rewardsLabel,
  rewardTooltip
}) => {
  const accountPkh = useAccountPkh();
  const { t } = useTranslation(['farm']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.reward, modeClass[colorThemeMode], className)}>
      <div className={styles.container}>
        {accountPkh ? (
          <>
            <div className={styles.titleWrapper}>
              {totalPendingRewards ? (
                <span className={styles.title} data-test-id="farmingListYourClaimableAndFullRewards">
                  {t('farm|Your Claimable')}
                  <span className={styles.slash}>{'/'}</span>
                  <p className={styles.fullRewards}>{t('farm|Your Full Rewards')}</p>
                  {isExist(rewardTooltip) && <Tooltip content={rewardTooltip} />}
                </span>
              ) : (
                <span className={styles.title} data-test-id="farmingYourFullRewards">
                  {rewardsLabel ?? t('farm|Your Full Rewards')}
                  {isExist(rewardTooltip) && <Tooltip content={rewardTooltip} />}
                </span>
              )}
            </div>
            <div className={styles.statesOfCurrencysAmount} data-test-id="farmingListStateCurrencyAmount">
              <StateCurrencyAmount
                className={styles.amount}
                amount={claimablePendingRewards}
                currency={currency}
                dollarEquivalent={dollarEquivalent}
                isError={isError}
                amountDecimals={amountDecimals}
                isLeftCurrency={currency === '$'}
                data-test-id="yourClaimableReward"
              />
              {totalPendingRewards && (
                <>
                  <div className={styles.bigSlash}>{'/'}</div>
                  <StateCurrencyAmount
                    className={styles.amount}
                    amount={totalPendingRewards}
                    currency={currency}
                    isError={isError}
                    dollarEquivalent={dollarEquivalent}
                    amountDecimals={amountDecimals}
                    isLeftCurrency={currency === '$'}
                    data-test-id="yourFullReward"
                  />
                </>
              )}
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
