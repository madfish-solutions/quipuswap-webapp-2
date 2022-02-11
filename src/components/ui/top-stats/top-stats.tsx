import { FC } from 'react';

import { StateCurrencyAmount } from '../state-components/state-currency-amount';
import styles from './top-stats.module.scss';

interface TopStatsProps {
  title: string;
  amount: string;
}

export const TopStats: FC<TopStatsProps> = ({ title, amount }) => {
  return (
    <div className={styles.container}>
      <span className={styles.title}>{title}</span>
      <StateCurrencyAmount className={styles.currencyAmount} currency="$" amount={amount} isLeftCurrency />
    </div>
  );
};
