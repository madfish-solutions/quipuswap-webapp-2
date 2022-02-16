import { FC, useState } from 'react';

import BigNumber from 'bignumber.js';

import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';

import styles from './reward-item.module.scss';

interface Props {
  title: string;
  amount: BigNumber;
  currency: string;
}

export const RewardItem: FC<Props> = ({ title, amount, currency }) => {
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 1500);

  return (
    <div>
      <span className={styles.title}>{title}</span>
      <StateCurrencyAmount
        className={styles.content}
        isLoading={loading}
        amount={amount}
        currency={currency}
        isLeftCurrency={currency === '$'}
      />
    </div>
  );
};
