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
import styles from './state-currency-amount.module.scss';

export interface StateCurrencyAmountProps extends Partial<StateWrapperProps>, DataTestAttribute {
  className?: string;
  amountClassName?: string;
  amount: Nullable<BigNumber.Value>;
  currency?: Nullable<string>;
  labelSize?: keyof typeof sizeClass;
  isLeftCurrency?: boolean;
  dollarEquivalent?: Nullable<BigNumber.Value>;
  amountDecimals?: Nullable<number>;
  options?: FormatNumberOptions;
  aliternativeView?: Nullable<string>;
  approximately?: boolean;
  noSpace?: boolean;
  dollarEquivalentOnly?: boolean;
}

const sizeClass = {
  extraLarge: styles.extraLarge,
  large: styles.large,
  small: styles.small
};

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

const EPPROXIMATILY_SIGN = '~';

export const Currency: FC = ({ children }) => <span className={styles.currency}>{children}</span>;

export const StateCurrencyAmount: FC<StateCurrencyAmountProps> = ({
  className,
  amountClassName,
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
  approximately,
  noSpace,
  testId,
  dollarEquivalentOnly
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const wrapClassName = cx(
    styles.amount,
    { [styles.isLeftCurrency]: isLeftCurrency },
    sizeClass[labelSize],
    modeClass[colorThemeMode],
    { [styles.noSpace]: noSpace },
    className
  );
  const wrapAmountClassName = cx(styles.inner, amountClassName);

  const wrapIsLoading = isLoading ?? (!isExist(amount) || amount === '');
  const wrapLoaderFallback = loaderFallback ?? <DashPlug />;
  const wrapErrorFallback = errorFallback ?? <DashPlug animation={false} />;

  const isLeftVisible = isLeftCurrency && currency;
  const isRightVisible = !isLeftCurrency && currency;

  const formattedAmount = amount ? formatValueBalance(amount, amountDecimals ?? undefined) : null;

  const title = amount ? new BigNumber(amount).toFixed() : undefined;

  const content = (
    <span className={wrapClassName}>
      {approximately && EPPROXIMATILY_SIGN}

      {isLeftVisible && <Currency>{currency}</Currency>}

      <StateWrapper
        isLoading={wrapIsLoading}
        loaderFallback={wrapLoaderFallback}
        isError={isError}
        errorFallback={wrapErrorFallback}
      >
        <span data-test-id={testId} className={wrapAmountClassName} title={title}>
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
    <div className={cx(styles.root, modeClass[colorThemeMode], className)}>
      {!dollarEquivalentOnly ? content : null}
      <StateDollarEquivalent dollarEquivalent={dollarEquivalent} />
    </div>
  );
};
