import { BigNumber } from 'bignumber.js';

import { DashPlug, SmileCondition } from '@shared/components';
import { FormatNumber, isExist, isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

import styles from './price-impact.module.scss';

const PRICE_IMPACT_DECIMALS = 2;
const DEFAULT_PRICE_IMPACT = 0;

const MINIMUM_VALUE_PERCENT = 3;
const AVERAGE_VALUE_PERCENT = 5;

const EMPTY_CLASSNAME = '';

enum Color {
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  RED = 'RED'
}

const colorStyle = {
  [Color.GREEN]: styles.green,
  [Color.YELLOW]: styles.yellow,
  [Color.RED]: styles.red
};

const getCondition = (priceImpact: Nullable<BigNumber.Value>) => {
  if (isNull(priceImpact)) {
    return null;
  }

  const wrapPriceImpact = new BigNumber(priceImpact);

  if (wrapPriceImpact.isLessThan(MINIMUM_VALUE_PERCENT)) {
    return SmileCondition.POSITIVE;
  }

  if (wrapPriceImpact.isLessThan(AVERAGE_VALUE_PERCENT)) {
    return SmileCondition.NEUTRAL;
  }

  return SmileCondition.NEGATIVE;
};

const getStyle = (priceImpact: Nullable<BigNumber.Value>) => {
  if (isNull(priceImpact)) {
    return EMPTY_CLASSNAME;
  }

  const wrapPriceImpact = new BigNumber(priceImpact);

  if (wrapPriceImpact.isLessThan(MINIMUM_VALUE_PERCENT)) {
    return colorStyle[Color.GREEN];
  }

  if (wrapPriceImpact.isLessThan(AVERAGE_VALUE_PERCENT)) {
    return colorStyle[Color.YELLOW];
  }

  return colorStyle[Color.RED];
};

const formatPriceImpact = (priceImpact: Nullable<BigNumber.Value>) => {
  const wrapPriceImpact = isNull(priceImpact) ? null : new BigNumber(priceImpact);

  if (!isNull(wrapPriceImpact) && wrapPriceImpact.isLessThan('0.1')) {
    return '<0.01';
  }

  return FormatNumber(wrapPriceImpact ?? DEFAULT_PRICE_IMPACT, { decimals: PRICE_IMPACT_DECIMALS });
};

export const usePriceImpactViewModel = (priceImpact: Nullable<BigNumber.Value>) => {
  const isLoading = !isExist(priceImpact) || priceImpact === '';
  const loaderFallback = <DashPlug />;
  const errorFallback = <DashPlug animation={false} />;
  const condition = getCondition(priceImpact);
  const priceImpactClassName = getStyle(priceImpact);

  const wrapPriceImpact = formatPriceImpact(priceImpact);

  return {
    condition,
    priceImpactClassName,
    isLoading,
    loaderFallback,
    errorFallback,
    wrapPriceImpact
  };
};
