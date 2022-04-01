import { FC } from 'react';

import { BigNumber } from 'bignumber.js';

import { Optional } from '@shared/types';
import { DataTestAttribute } from 'tests/types';

import { StateCurrencyAmount } from '../state-components';
import { Tooltip } from '../tooltip';
import styles from './top-stats.module.scss';

interface TopStatsProps extends Required<DataTestAttribute> {
  title: string;
  amount: Optional<BigNumber>;
  tooltip: string;
  testId: string;
}

export const TopStats: FC<TopStatsProps> = ({ title, amount, tooltip, testId }) => {
  return (
    <div className={styles.container}>
      <span className={styles.title}>
        {title} <Tooltip content={tooltip} />
      </span>

      <StateCurrencyAmount
        testId={testId}
        className={styles.currencyAmount}
        currency="$"
        amount={amount || null}
        isLeftCurrency
      />
    </div>
  );
};
