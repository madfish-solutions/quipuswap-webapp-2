import { FC } from 'react';

import { BigNumber } from 'bignumber.js';

import { DOLLAR } from '@config/constants';
import { isEqual } from '@shared/helpers';
import { Optional } from '@shared/types';

import { StateCurrencyAmount } from '../state-components';
import { Tooltip } from '../tooltip';
import styles from './top-stats.module.scss';

interface TopStatsProps {
  title: string;
  amount: Optional<BigNumber>;
  tooltip: string;
  currency?: Nullable<string>;
}

export const TopStats: FC<TopStatsProps> = ({ title, amount, tooltip, currency = DOLLAR }) => {
  const isDollar = isEqual(currency, DOLLAR);

  return (
    <div className={styles.container} data-test-id={title}>
      <span className={styles.title}>
        <span data-test-id="topStatsTitle">{title}</span> <Tooltip content={tooltip} />
      </span>

      <StateCurrencyAmount
        className={styles.currencyAmount}
        currency={currency}
        amount={amount || null}
        isLeftCurrency={isDollar}
      />
    </div>
  );
};
