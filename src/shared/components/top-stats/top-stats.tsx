import { FC } from 'react';

import { BigNumber } from 'bignumber.js';

import { Optional } from '@shared/types';

import { StateCurrencyAmount } from '../state-components';
import { Tooltip } from '../tooltip';
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
        <span data-test-id="topStatsTitle">{title}</span> <Tooltip content={tooltip} />
      </span>

      <StateCurrencyAmount className={styles.currencyAmount} currency="$" amount={amount || null} isLeftCurrency />
    </div>
  );
};
