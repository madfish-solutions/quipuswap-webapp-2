import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { FormatNumber } from '@utils/formatNumber';
import { Nullable } from '@utils/types';

import { StateCurrencyAmount } from '../state-currency-amount';

interface StatePriceImpactProps {
  priceImpact: Nullable<BigNumber.Value>;
}

export const StatePriceImpact: FC<StatePriceImpactProps> = ({ priceImpact }) => {
  const wrapPriceImpact = new BigNumber(priceImpact ?? NaN);

  const amount = wrapPriceImpact.lt(0.01) ? '<0.01' : FormatNumber(priceImpact ?? 0, { decimals: 2 });

  return <StateCurrencyAmount isLoading={wrapPriceImpact.isNaN()} amount={amount} currency="%" />;
};
