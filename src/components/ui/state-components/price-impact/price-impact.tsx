import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { Nullable } from '@utils/types';

import { StateCurrencyAmount } from '../state-currency-amount';

interface StatePriceImpactProps {
  priceImpact: Nullable<BigNumber.Value>;
}

export const StatePriceImpact: FC<StatePriceImpactProps> = ({ priceImpact }) => {
  return <StateCurrencyAmount isLoading={priceImpact === null} amount={priceImpact} currency="%" />;
};
