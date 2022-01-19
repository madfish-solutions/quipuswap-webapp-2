import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { StateWrapper, StateWrapperProps } from '@components/state-wrapper';
import { FormatNumber, FormatNumberOptions } from '@utils/formatNumber';
import { isExist } from '@utils/helpers';
import { Nullable } from '@utils/types';

import { DashPlug } from '../../dash-plug';
import { StateDollarEquivalent } from '../state-dollar-equivalent';
import s from './state-currency-amount.module.sass';

export interface StateCurrencyAmountProps extends Partial<StateWrapperProps> {
  className?: string;
  amount: Nullable<BigNumber.Value>;
  currency?: Nullable<string>;
  labelSize?: keyof typeof sizeClass;
  isLeftCurrency?: boolean;
  dollarEquivalent?: string;
  amountDecimals?: number;
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

const Currency: FC = ({ children }) => <span className={s.currency}>{children}</span>;

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
  aliternativeView
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

  const content = (
    <span className={wrapClassName}>
      {isLeftVisible && <Currency>{currency}</Currency>}

      <StateWrapper
        isLoading={wrapIsLoading}
        loaderFallback={wrapLoaderFallback}
        isError={isError}
        errorFallback={wrapErrorFallback}
      >
        <span className={s.inner}>{aliternativeView ?? FormatNumber(amount ?? 0, { decimals: amountDecimals })}</span>
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
