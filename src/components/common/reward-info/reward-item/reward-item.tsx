import { FC } from 'react';

import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';

import styles from './reward-item.module.scss';

interface Props {
  title: string;
  amount: string;
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
