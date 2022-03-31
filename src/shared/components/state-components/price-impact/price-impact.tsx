import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { isNull } from '../../../helpers';
import { Nullable } from '../../../types/types';
import { Smiles } from '../../smiles';
import { StateWrapper } from '../../state-wrapper';
import { Currency } from '../state-currency-amount';
import s from './price-impact.module.scss';
import { usePriceImpactViewModel } from './use-price-impact.vm';

interface StatePriceImpactProps {
  priceImpact: Nullable<BigNumber.Value>;
}

export const StatePriceImpact: FC<StatePriceImpactProps> = ({ priceImpact }) => {
  const { condition, priceImpactClassName, isLoading, loaderFallback, errorFallback, wrapPriceImpact } =
    usePriceImpactViewModel(priceImpact);

  return (
    <span className={s.amount}>
      <StateWrapper
        isLoading={isLoading}
        loaderFallback={loaderFallback}
        isError={isNull(priceImpact)}
        errorFallback={errorFallback}
      >
        <span className={priceImpactClassName}>{wrapPriceImpact}</span>
        <Currency>%</Currency>
        <Smiles condition={condition} />
      </StateWrapper>
    </span>
  );
};
