import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { Optional } from '@utils/types';

import { AmountRule, StateCurrencyAmount } from '../state-components/state-currency-amount';
import styles from './top-stats.module.scss';

interface TopStatsProps {
  title: string;
  amount: Optional<BigNumber>;
}

export const TopStats: FC<TopStatsProps> = ({ title, amount }) => {
  return (
    <div className={styles.container}>
      <span className={styles.title}>{title}</span>
      <StateCurrencyAmount
        className={styles.currencyAmount}
        currency="$"
        amount={amount || null}
        amountRule={AmountRule.LetterShort}
        isLeftCurrency
      />
    </div>
  );
};
