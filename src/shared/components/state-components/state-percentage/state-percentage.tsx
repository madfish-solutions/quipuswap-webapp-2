import { FC } from 'react';

import { BigNumber } from 'bignumber.js';

import { isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { StateCurrencyAmount } from '../state-currency-amount';

interface Props {
  isLoading: boolean;
  value: Nullable<BigNumber.Value>;
}

export const StatePercentage: FC<Props> = ({ isLoading, value }) => {
  return <StateCurrencyAmount isError={!isLoading && isNull(value)} amount={value} currency="%" />;
};
