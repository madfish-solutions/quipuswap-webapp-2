import { FC } from 'react';

import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { StateWrapper, StateWrapperProps } from '@components/state-wrapper';
import { SmileGreen, SmileRed, SmileYellow } from '@components/svg/Smiles';
import { DashPlug } from '@components/ui/dash-plug';
import { FormatNumber } from '@utils/formatNumber';
import { formatValueBalance, isExist, isNull } from '@utils/helpers';
import { Nullable } from '@utils/types';

import { Currency } from '../state-currency-amount';
import s from './price-impact.module.sass';

interface StatePriceImpactProps extends Partial<StateWrapperProps> {
  priceImpact: Nullable<BigNumber.Value>;
  balanceRule?: boolean;
}
const PRICE_IMPACT_DECIMALS = 2;

const MINIMUM_VALUE_PERCENT = 3;
const AVERAGE_VALUE_PERCENT = 5;

enum Color {
  GREEN = 'green',
  YELLOW = 'yellow',
  RED = 'red'
}

const smileClass = {
  [Color.GREEN]: <SmileGreen />,
  [Color.YELLOW]: <SmileYellow />,
  [Color.RED]: <SmileRed />
};

const styleClass = {
  [Color.GREEN]: s.green,
  [Color.YELLOW]: s.yellow,
  [Color.RED]: s.red
};

const determineIconOrStyleClass = (amount: number, icon?: boolean) => {
  if (amount < MINIMUM_VALUE_PERCENT) {
    return icon ? smileClass[Color.GREEN] : styleClass[Color.GREEN];
  }

  if (amount >= MINIMUM_VALUE_PERCENT && amount <= AVERAGE_VALUE_PERCENT) {
    return icon ? smileClass[Color.YELLOW] : styleClass[Color.YELLOW];
  }

  return icon ? smileClass[Color.RED] : styleClass[Color.RED];
};

export const StatePriceImpact: FC<StatePriceImpactProps> = ({
  priceImpact,
  isLoading,
  loaderFallback,
  errorFallback,
  balanceRule
}) => {
  const wrapPriceImpact = isNull(priceImpact) ? null : new BigNumber(priceImpact);

  const aliternativeView = wrapPriceImpact?.lt(0.01) ? '<0.01' : null;

  const wrapIsLoading = isLoading ?? (!isExist(priceImpact) || priceImpact === '');
  const wrapLoaderFallback = loaderFallback ?? <DashPlug />;
  const wrapErrorFallback = errorFallback ?? <DashPlug animation={false} />;

  const FormattedNumber = balanceRule
    ? formatValueBalance(priceImpact)
    : FormatNumber(priceImpact ?? 0, { decimals: PRICE_IMPACT_DECIMALS });

  return (
    <span className={s.amount}>
      <StateWrapper
        isLoading={wrapIsLoading}
        loaderFallback={wrapLoaderFallback}
        isError={isNull(priceImpact)}
        errorFallback={wrapErrorFallback}
      >
        <span className={cx(priceImpact ? determineIconOrStyleClass(+priceImpact) : null)}>
          {aliternativeView ?? FormattedNumber}
        </span>
        <Currency>%</Currency>
        {priceImpact ? determineIconOrStyleClass(+priceImpact, true) : null}
      </StateWrapper>
    </span>
  );
};
