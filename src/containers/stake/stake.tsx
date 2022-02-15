import { FC } from 'react';

import { UserRewardInfo } from '@components/common/user-reward-info';
import { Button } from '@components/ui/elements/button';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';

import { StakeList } from './list';
import styles from './stake.module.scss';

interface Props {
  amount?: string;
  currency?: string;
}

export const Stake: FC<Props> = ({ amount = '1000000', currency = '$' }) => {
  return (
    <>
      <UserRewardInfo>
        <div>
          <span className={styles.title}>Your Share</span>
          <StateCurrencyAmount
            className={styles.content}
            amount={amount}
            currency={currency}
            isLeftCurrency={currency === '$'}
          />
        </div>
        <div>
          <span className={styles.title}>Your Claimed</span>
          <StateCurrencyAmount
            className={styles.content}
            amount={amount}
            currency={currency}
            isLeftCurrency={currency === '$'}
          />
        </div>
        <div>
          <span className={styles.title}>Your Claimed</span>
          <Button href="/asd" theme="inverse" className={styles.content}>
            TZKT
          </Button>
        </div>
      </UserRewardInfo>
      <StakeList />
    </>
  );
};
