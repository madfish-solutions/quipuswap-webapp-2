import { FC, useContext } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { FormatNumberOptions, formatValueBalance, isExist } from '@shared/helpers';
import { Nullable } from '@shared/types';
import { DataTestAttribute } from 'tests/types';

import { DashPlug } from '../../dash-plug';
import { StateDollarEquivalent } from '../state-dollar-equivalent';
import { StateWrapper, StateWrapperProps } from '../state-wrapper';
import s from './state-currency-amount.module.sass';

export interface StateCurrencyAmountProps extends Partial<StateWrapperProps>, DataTestAttribute {
  className?: string;
  amount: Nullable<BigNumber.Value>;
  currency?: Nullable<string>;
  labelSize?: keyof typeof sizeClass;
  isLeftCurrency?: boolean;
  dollarEquivalent?: Nullable<BigNumber.Value>;
  amountDecimals?: Nullable<number>;
  options?: FormatNumberOptions;
  aliternativeView?: Nullable<string>;
}

const sizeClass = {
  extraLarge: s.extraLarge,
  large: s.large,
  small: s.small
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const Currency: FC = ({ children }) => <span className={s.currency}>{children}</span>;

export const StateCurrencyAmount: FC<StateCurrencyAmountProps> = ({
  className,
  labelSize = 'small',
  amount,
  currency,
  isLeftCurrency = false,
  dollarEquivalent,
  isLoading,
  loaderFallback,
  isError,
  errorFallback,
  amountDecimals,
  aliternativeView,
  testId
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const wrapClassName = cx(
    s.amount,
    { [s.isLeftCurrency]: isLeftCurrency },
    sizeClass[labelSize],
    modeClass[colorThemeMode],
    className
  );

  const wrapIsLoading = isLoading ?? (!isExist(amount) || amount === '');
  const wrapLoaderFallback = loaderFallback ?? <DashPlug />;
  const wrapErrorFallback = errorFallback ?? <DashPlug animation={false} />;

  const isLeftVisible = isLeftCurrency && currency;
  const isRightVisible = !isLeftCurrency && currency;

  const formattedAmount = amount ? formatValueBalance(amount, amountDecimals ?? undefined) : null;

  const title = amount ? new BigNumber(amount).toFixed() : undefined;

  const content = (
    <span className={wrapClassName}>
      {isLeftVisible && <Currency>{currency}</Currency>}

      <StateWrapper
        isLoading={wrapIsLoading}
        loaderFallback={wrapLoaderFallback}
        isError={isError}
        errorFallback={wrapErrorFallback}
      >
        <span data-test-id={testId} className={s.inner} title={title}>
          {aliternativeView ?? formattedAmount}
        </span>
      </StateWrapper>

      {isRightVisible && <Currency>{currency}</Currency>}
    </span>
  );

  if (!dollarEquivalent) {
    return content;
  }

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      {content}
      <StateDollarEquivalent dollarEquivalent={dollarEquivalent} />
    </div>
  );
};
