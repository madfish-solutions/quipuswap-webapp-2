import { ReactElement } from 'react';

import BigNumber from 'bignumber.js';

import { DashPlug } from '@components/ui/dash-plug';
import { FormatNumber } from '@utils/formatNumber';
import { formatValueBalance, isExist, isNull } from '@utils/helpers';
import { Nullable } from '@utils/types';

import { SmileCondition } from '../../../smiles/smiles';
import s from './price-impact.module.sass';

const PRICE_IMPACT_DECIMALS = 2;

const MINIMUM_VALUE_PERCENT = 3;
const AVERAGE_VALUE_PERCENT = 5;

enum Color {
  GREEN = 'green',
  YELLOW = 'yellow',
  RED = 'red'
}

const colorStyle = {
  [Color.GREEN]: s.green,
  [Color.YELLOW]: s.yellow,
  [Color.RED]: s.red
};

const getCondition = (priceImpact: Nullable<BigNumber.Value>) => {
  if (!priceImpact) {
    return;
  }

  if (priceImpact < MINIMUM_VALUE_PERCENT) {
    return SmileCondition.positive;
  }

  if (priceImpact >= MINIMUM_VALUE_PERCENT && priceImpact <= AVERAGE_VALUE_PERCENT) {
    return SmileCondition.neutral;
  }

  return SmileCondition.negative;
};

const getStyle = (priceImpact: Nullable<BigNumber.Value>) => {
  if (!priceImpact) {
    return;
  }

  if (priceImpact < MINIMUM_VALUE_PERCENT) {
    return colorStyle[Color.GREEN];
  }

  if (priceImpact >= MINIMUM_VALUE_PERCENT && priceImpact <= AVERAGE_VALUE_PERCENT) {
    return colorStyle[Color.YELLOW];
  }

  return colorStyle[Color.RED];
};

export const usePriceImpactViewModel = (
  priceImpact: Nullable<BigNumber.Value>,
  isLoading?: boolean,
  loaderFallback?: ReactElement,
  errorFallback?: ReactElement,
  balanceRule?: boolean
) => {
  const wrapPriceImpact = isNull(priceImpact) ? null : new BigNumber(priceImpact);

  const alternativeView = wrapPriceImpact?.lt(0.01) ? '<0.01' : null;

  const wrapIsLoading = isLoading ?? (!isExist(priceImpact) || priceImpact === '');
  const wrapLoaderFallback = loaderFallback ?? <DashPlug />;
  const wrapErrorFallback = errorFallback ?? <DashPlug animation={false} />;

  const FormattedNumber = balanceRule
    ? formatValueBalance(priceImpact)
    : FormatNumber(priceImpact ?? 0, { decimals: PRICE_IMPACT_DECIMALS });

  const condition = getCondition(priceImpact);
  const priceImpactClassName = getStyle(priceImpact);

  return {
    alternativeView,
    condition,
    priceImpactClassName,
    wrapIsLoading,
    wrapLoaderFallback,
    wrapErrorFallback,
    FormattedNumber
  };
};
