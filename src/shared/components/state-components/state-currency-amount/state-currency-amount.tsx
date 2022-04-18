import { FC, ReactNode, useContext } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { FormatNumberOptions, formatValueBalance, isExist } from '@shared/helpers';
import { Nullable } from '@shared/types';
import { DexDashboardTestAttribute } from 'tests/types';

import { DashPlug } from '../../dash-plug';
import { StateDollarEquivalent } from '../state-dollar-equivalent';
import { StateWrapper, StateWrapperProps } from '../state-wrapper';
import styles from './state-currency-amount.module.scss';

export interface StateCurrencyAmountProps extends Partial<StateWrapperProps>, DexDashboardTestAttribute {
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

interface CurrencyProps {
  testId?: string;
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

export const Currency: FC<CurrencyProps> = ({ testId, children }) => (
  <span className={styles.currency} data-test-id={testId}>
    {children}
  </span>
);

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
  currencyTestId,
  amountTestId
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const wrapClassName = cx(
    styles.amount,
    { [styles.isLeftCurrency]: isLeftCurrency },
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
        <span data-test-id={amountTestId} className={styles.inner} title={title}>
          {aliternativeView ?? formattedAmount}
        </span>
      </StateWrapper>

      {isRightVisible && <Currency testId={currencyTestId}>{currency}</Currency>}
    </span>
  );

  if (!dollarEquivalent) {
    return content;
  }

  return (
    <div className={cx(styles.root, modeClass[colorThemeMode], className)}>
      {content}
      <StateDollarEquivalent dollarEquivalent={dollarEquivalent} />
    </div>
  );
};
