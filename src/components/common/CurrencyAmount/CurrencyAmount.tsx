import React, { useContext } from 'react';
import cx from 'classnames';

import { prettyPrice } from '@utils/helpers';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './CurrencyAmount.module.sass';

type CurrencyAmountProps = {
  className?: string
  amount: string
  currency?: string
  dollarEquivalent?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const CurrencyAmount: React.FC<CurrencyAmountProps> = ({
  className,
  amount,
  currency,
  dollarEquivalent,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const content = (
    <span className={cx(s.amount, modeClass[colorThemeMode])}>
      <span className={s.inner}>
        {parseFloat(amount) ? prettyPrice(parseFloat(amount), 8, 40) : amount}
      </span>
      {currency && (<span className={s.currency}>{currency}</span>)}
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
          {prettyPrice(parseFloat(dollarEquivalent), 8, 40)}
        </span>
      </span>
    </div>
  );
};
