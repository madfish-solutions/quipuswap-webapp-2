import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { Optional } from '@utils/types';

import { Tooltip } from '../components/tooltip';
import { StateCurrencyAmount } from '../state-components/state-currency-amount';
import styles from './top-stats.module.scss';

interface TopStatsProps {
  title: string;
  amount: Optional<BigNumber>;
  tooltip: string;
}

export const TopStats: FC<TopStatsProps> = ({ title, amount, tooltip }) => {
  return (
    <div className={styles.container}>
      <span className={styles.title}>
        {title} <Tooltip content={tooltip} />
      </span>

      <StateCurrencyAmount className={styles.currencyAmount} currency="$" amount={amount || null} isLeftCurrency />
    </div>
  );
};
