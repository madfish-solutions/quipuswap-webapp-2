import React, { useContext } from 'react';
import { ColorModes, ColorThemeContext } from '@madfish-solutions/quipu-ui-kit';
import cx from 'classnames';

import { prettyPrice } from '@utils/helpers';

import s from './CurrencyAmount.module.sass';

type CurrencyAmountProps = {
  className?: string
  amount: string
  currency?: string
  labelSize?: keyof typeof sizeClass
  isRightCurrency?: boolean
  dollarEquivalent?: string
  decimals?: number
  length?: number
};

const sizeClass = {
  extraLarge: s.extraLarge,
  large: s.large,
  small: s.small,
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const CurrencyAmount: React.FC<CurrencyAmountProps> = ({
  className,
  labelSize = 'small',
  amount,
  currency,
  isRightCurrency = false,
  dollarEquivalent,
  decimals = 8,
  length = 40,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const content = (
    <span className={cx(
      s.amount,
      { [s.isRightCurrency]: isRightCurrency },
      sizeClass[labelSize],
      modeClass[colorThemeMode],
      className,
    )}
    >
      {currency && isRightCurrency && (<span className={s.currency}>{currency}</span>)}
      <span className={s.inner}>
        {parseFloat(amount) ? prettyPrice(parseFloat(amount), decimals, length) : amount}
      </span>
      {currency && !isRightCurrency && (<span className={s.currency}>{currency}</span>)}
    </span>
  );

  if (!dollarEquivalent) {
    return content;
  }

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      {content}
      <span className={s.dollarEquivalent}>
        ≈ $
        {' '}
        <span className={s.dollarEquivalentInner}>
          {prettyPrice(parseFloat(dollarEquivalent), decimals, length)}
        </span>
      </span>
    </div>
  );
};
