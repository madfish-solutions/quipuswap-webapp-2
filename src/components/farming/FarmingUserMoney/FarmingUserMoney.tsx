import React, { FC } from 'react';

import { useAccountPkh } from '@utils/dapp';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Skeleton } from '@components/ui/Skeleton';

import s from './FarmingUserMoney.module.sass';

interface FarmingUserMoneyProps {
  money?: string
}

export const FarmingUserMoney:FC<FarmingUserMoneyProps> = ({ money }) => {
  const accountPkh = useAccountPkh();

  if (!accountPkh) {
    return (
      <div>
        <span className={s.dollarSign}>$</span>
        0
      </div>
    );
  }

  if (money) {
    return (
      <div>
        <span className={s.dollarSign}>$</span>
        {' '}
        <CurrencyAmount amount={money} />
      </div>
    );
  }

  return (<Skeleton className={s.skeleton} />);
};
