import { FC, HTMLProps, ReactNode, useContext } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';

import { EPPROXIMATILY_SIGN } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { FormatNumberOptions, formatValueBalance, isExist } from '@shared/helpers';
import { Nullable, Optional } from '@shared/types';

import { DashPlug } from '../../dash-plug';
import { StateDollarEquivalent } from '../state-dollar-equivalent';
import { StateWrapper, StateWrapperProps } from '../state-wrapper';
import styles from './state-currency-amount.module.scss';

export interface StateCurrencyAmountProps extends Partial<StateWrapperProps> {
  className?: string;
  amountClassName?: string;
  currencyClassName?: string;
  amount: Optional<BigNumber.Value>;
  currency?: Nullable<string>;
  labelSize?: keyof typeof sizeClass;
  isLeftCurrency?: boolean;
  dollarEquivalent?: Nullable<BigNumber.Value>;
  amountDecimals?: Nullable<number>;
  options?: FormatNumberOptions;
  approximately?: boolean;
  noSpace?: boolean;
  dollarEquivalentOnly?: boolean;
  testId?: string;
  maxAmountWithoutLetters?: number;
}

interface CurrencyProps extends HTMLProps<HTMLDivElement> {
  children?: ReactNode;
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

export const Currency: FC<CurrencyProps> = ({ children, className, ...props }) => (
  <span className={cx(className, styles.currency)} {...props}>
    {children}
  </span>
);

const MAX_AMOUNT_WITHOUT_LETTERS = 1e6;

export const StateCurrencyAmount: FC<StateCurrencyAmountProps> = ({
  className,
  amountClassName,
  currencyClassName,
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
  approximately,
  noSpace,
  dollarEquivalentOnly,
  testId = 'amount',
  maxAmountWithoutLetters = MAX_AMOUNT_WITHOUT_LETTERS,
  ...props
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

  const formattedAmount = amount
    ? formatValueBalance(amount, amountDecimals ?? undefined, maxAmountWithoutLetters)
    : null;

  const title = amount ? new BigNumber(amount).toFixed() : undefined;

  const content = (
    <span className={wrapClassName} {...props}>
      {approximately && EPPROXIMATILY_SIGN}

      {isLeftVisible && <Currency data-test-id="leftVisibleCurrency">{currency}</Currency>}

      <StateWrapper
        isLoading={wrapIsLoading}
        loaderFallback={wrapLoaderFallback}
        isError={isError}
        errorFallback={wrapErrorFallback}
      >
        <span data-test-id={testId} className={wrapAmountClassName} title={title}>
          {formattedAmount}
        </span>
      </StateWrapper>

      {isRightVisible && (
        <Currency data-test-id="rightVisibleCurrency" className={currencyClassName}>
          {currency}
        </Currency>
      )}
    </span>
  );

  if (!dollarEquivalent) {
    return content;
  }

  return (
    <div className={cx(styles.root, modeClass[colorThemeMode], className)} {...props}>
      {!dollarEquivalentOnly ? content : null}
      <StateDollarEquivalent dollarEquivalent={dollarEquivalent} className={styles.dollarEquivalentOnly} />
    </div>
  );
};
