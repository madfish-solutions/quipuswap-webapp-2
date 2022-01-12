import React, { useContext } from 'react';

import { ColorModes, ColorThemeContext, DollarEquivalent, FormatNumber } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { DASH_CHAR } from '@app.config';
import { Nullable } from '@utils/types';

import s from './currency-amount.module.sass';

export interface CurrencyAmountProps {
  className?: string;
  amount: Nullable<BigNumber.Value>;
  currency?: string;
  labelSize?: keyof typeof sizeClass;
  isLeftCurrency?: boolean;
  dollarEquivalent?: string;
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

export const CurrencyAmount: React.FC<CurrencyAmountProps> = ({
  className,
  labelSize = 'small',
  amount = null,
  currency,
  isLeftCurrency = false,
  dollarEquivalent
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const value = amount !== null ? FormatNumber(amount) : DASH_CHAR;

  const content = (
    <span
      className={cx(
        s.amount,
        { [s.isLeftCurrency]: isLeftCurrency },
        sizeClass[labelSize],
        modeClass[colorThemeMode],
        className
      )}
    >
      {currency && isLeftCurrency && <span className={s.currency}>{currency}</span>}
      <span className={s.inner}>{value}</span>
      {currency && !isLeftCurrency && <span className={s.currency}>{currency}</span>}
    </span>
  );

  if (!dollarEquivalent) {
    return content;
  }

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      {content}
      <DollarEquivalent dollarEquivalent={dollarEquivalent} />
    </div>
  );
};
