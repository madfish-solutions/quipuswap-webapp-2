import { FC, ReactNode } from 'react';

import { BigNumber } from 'bignumber.js';

import { DOLLAR } from '@config/constants';
import { isEqual, isExist } from '@shared/helpers';
import { Nullable, Optional } from '@shared/types';

import styles from './top-stats.module.scss';
import { StateCurrencyAmount } from '../state-components';
import { Tooltip } from '../tooltip';

interface TopStatsProps {
  title: string;
  amount: Optional<BigNumber>;
  tooltip: string;
  currency?: Nullable<string>;
  isError?: boolean;
  children?: ReactNode;
}

export const TopStats: FC<TopStatsProps> = ({ title, amount, tooltip, isError, currency = DOLLAR, children }) => {
  const isDollar = isEqual(currency, DOLLAR);
  const loading = !isExist(amount);

  return (
    <div className={styles.container} data-test-id={title}>
      <span className={styles.title}>
        <span data-test-id="topStatsTitle">{title}</span> <Tooltip content={tooltip} />
      </span>

      {children ?? (
        <StateCurrencyAmount
          className={styles.currencyAmount}
          currency={currency}
          isError={isError}
          isLoading={loading}
          amount={amount || null}
          isLeftCurrency={isDollar}
          maxAmountWithoutLetters={1e9}
        />
      )}
    </div>
  );
};
