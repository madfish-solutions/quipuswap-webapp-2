import { FC, useContext } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';

import { USD_DECIMALS } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { useAccountPkh } from '@providers/use-dapp';
import { StateCurrencyAmount, Tooltip } from '@shared/components';
import { GobletIcon } from '@shared/svg';
import { Nullable } from '@shared/types';
import { useTranslation } from '@translation';

import styles from './your-winnings.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props {
  amount: Nullable<BigNumber | string>;
  dollarEquivalent?: Nullable<BigNumber.Value>;
  amountDecimals?: number;
  currency: string;
  rewardTooltip: string;
  isLoading: boolean;
  className?: string;
}

export const YourWinningsReward: FC<Props> = ({
  amount,
  currency,
  dollarEquivalent,
  amountDecimals = USD_DECIMALS,
  rewardTooltip,
  isLoading,
  className
}) => {
  const accountPkh = useAccountPkh();
  const { t } = useTranslation(['coinflip']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.root, modeClass[colorThemeMode], className)}>
      <div className={styles.container}>
        {accountPkh ? (
          <>
            <div className={styles.titleWrapper}>
              <div className={styles.title}>{t('coinflip|yourWinnings')}</div>
              <Tooltip content={rewardTooltip} />
            </div>
            <div className={styles.statesOfCurrencysAmount}>
              <StateCurrencyAmount
                className={styles.amount}
                amount={amount}
                currency={currency}
                dollarEquivalent={dollarEquivalent}
                amountDecimals={amountDecimals}
                isLoading={isLoading}
                isLeftCurrency={currency === '$'}
              />
            </div>
          </>
        ) : (
          <div className={styles.alternativeTitle}>
            <div className={styles.title}>Connect Wallet now!</div>
            <div className={styles.description}>Here can be your reward</div>
          </div>
        )}
      </div>
      <GobletIcon />
    </div>
  );
};
