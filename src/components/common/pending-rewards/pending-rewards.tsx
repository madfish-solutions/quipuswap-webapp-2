import { FC, useContext, useState } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { Goblet } from '@components/svg/goblet';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';

import styles from './pending-rewards.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props {
  amount: BigNumber;
  currency: string;
}

export const PendingRewards: FC<Props> = ({ amount, currency }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['stake']);

  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 1500);

  return (
    <div className={cx(styles.reward, modeClass[colorThemeMode])}>
      <div>
        <span className={styles.title}>{t('stake|Your Pending Rewards')}</span>
        <StateCurrencyAmount
          className={styles.amount}
          amount={amount}
          isLoading={loading}
          currency={currency}
          isLeftCurrency={currency === '$'}
        />
      </div>
      <Goblet />
    </div>
  );
};
