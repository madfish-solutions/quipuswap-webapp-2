import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { isNull } from '@utils/helpers';
import { Nullable } from '@utils/types';

interface Props {
  isLoading: boolean;
  value: Nullable<BigNumber.Value>;
}
const PERCENTAGE_DECIMALS = 3;

export const StatePercentage: FC<Props> = ({ isLoading, value }) => {
  return (
    <StateCurrencyAmount
      isError={!isLoading && isNull(value)}
      amount={value}
      amountDecimals={PERCENTAGE_DECIMALS}
      currency="%"
    />
  );
};
