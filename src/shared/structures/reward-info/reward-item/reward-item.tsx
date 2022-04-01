import { FC } from 'react';

import { BigNumber } from 'bignumber.js';

import { StateCurrencyAmount } from '@shared/components';

import styles from './reward-item.module.scss';

interface Props {
  title: string;
  amount: BigNumber;
  currency: string;
}

export const RewardItem: FC<Props> = ({ title, amount, currency }) => {
  return (
    <div>
      <span className={styles.title}>{title}</span>
      <StateCurrencyAmount
        className={styles.content}
        amount={amount}
        currency={currency}
        isLeftCurrency={currency === '$'}
      />
    </div>
  );
};
