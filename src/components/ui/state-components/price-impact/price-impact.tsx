import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { isNull } from '@utils/helpers';
import { Nullable } from '@utils/types';

import { StateCurrencyAmount } from '../state-currency-amount';

interface StatePriceImpactProps {
  priceImpact: Nullable<BigNumber.Value>;
}

export const StatePriceImpact: FC<StatePriceImpactProps> = ({ priceImpact }) => {
  return <StateCurrencyAmount isLoading={isNull(priceImpact)} amount={priceImpact} currency="%" />;
};
