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
        $ 0
      </div>
    );
  }

  if (money) {
    return (<CurrencyAmount amount={money} />);
  }

  return (<Skeleton className={s.skeleton} />);
};
