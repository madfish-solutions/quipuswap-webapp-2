import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { isNull } from '@utils/helpers';
import { Nullable } from '@utils/types';

import { StateCurrencyAmount } from '../state-currency-amount';

interface StatePriceImpactProps {
  priceImpact: Nullable<BigNumber.Value>;
}
const PRICE_IMPACT_DECIMALS = 2;

export const StatePriceImpact: FC<StatePriceImpactProps> = ({ priceImpact }) => {
  const wrapPriceImpact = isNull(priceImpact) ? null : new BigNumber(priceImpact);

  const aliternativeView = wrapPriceImpact?.lt(0.01) ? '<0.01' : null;

  return (
    <StateCurrencyAmount
      isError={isNull(priceImpact)}
      amount={priceImpact}
      aliternativeView={aliternativeView}
      amountDecimals={PRICE_IMPACT_DECIMALS}
      currency="%"
    />
  );
};
