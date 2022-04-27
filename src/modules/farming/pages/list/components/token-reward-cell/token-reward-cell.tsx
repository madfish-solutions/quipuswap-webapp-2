import { FC } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';

import { StateCurrencyAmount } from '@shared/components';
import { Nullable } from '@shared/types';

import styles from './token-reward-cell.module.scss';

interface Props {
  amount: BigNumber;
  dollarEquivalent: Nullable<BigNumber>;
}

export const TokenRewardCell: FC<Props> = ({ amount, dollarEquivalent }) => {
  return (
    <div className={styles.tokenRewardCell}>
      <StateCurrencyAmount amountClassName={styles.toRight} amount={amount} />
      <StateCurrencyAmount
        amountClassName={cx(styles.dollarEquivalent, styles.toRight)}
        amount={dollarEquivalent}
        currency="$"
        isLeftCurrency
        approximately
        noSpace
      />
    </div>
  );
};
