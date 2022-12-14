import { FC } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';

import { StateCurrencyAmount } from '@shared/components';
import { Nullable } from '@shared/types';

import styles from './token-fee-cell.module.scss';

interface Props {
  amount: Nullable<BigNumber>;
  dollarEquivalent: Nullable<BigNumber>;
  isExchangeRatesError: boolean;
}

export const TokenFeeCell: FC<Props> = ({ amount, dollarEquivalent, isExchangeRatesError }) => {
  return (
    <div className={styles.tokenFeeCell}>
      <StateCurrencyAmount amountClassName={styles.toRight} amount={amount} />
      <StateCurrencyAmount
        amountClassName={cx(styles.dollarEquivalent, styles.toRight)}
        amount={dollarEquivalent}
        isError={isExchangeRatesError}
        currency="$"
        isLeftCurrency
        approximately
        noSpace
      />
    </div>
  );
};
