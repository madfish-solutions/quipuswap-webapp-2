import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { Smiles } from '@components/smiles/smiles';
import { StateWrapper, StateWrapperProps } from '@components/state-wrapper';
import { isNull } from '@utils/helpers';
import { Nullable } from '@utils/types';

import { Currency } from '../state-currency-amount';
import s from './price-impact.module.sass';
import { usePriceImpactViewModel } from './use-price-impact.vm';
interface StatePriceImpactProps extends Partial<StateWrapperProps> {
  priceImpact: Nullable<BigNumber.Value>;
}

export const StatePriceImpact: FC<StatePriceImpactProps> = ({ priceImpact }) => {
  const {
    alternativeView,
    condition,
    priceImpactClassName,
    wrapIsLoading,
    wrapLoaderFallback,
    wrapErrorFallback,
    FormattedNumber
  } = usePriceImpactViewModel(priceImpact);

  return (
    <span className={s.amount}>
      <StateWrapper
        isLoading={wrapIsLoading}
        loaderFallback={wrapLoaderFallback}
        isError={isNull(priceImpact)}
        errorFallback={wrapErrorFallback}
      >
        <span className={priceImpactClassName}>{alternativeView ?? FormattedNumber}</span>
        <Currency>%</Currency>
        {priceImpact ? <Smiles condition={condition} /> : null}
      </StateWrapper>
    </span>
  );
};
