import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { CurrencyAmount } from '@components/common/CurrencyAmount';

import s from './PortfolioCard.module.sass';

type PortfolioCardProps = {
  volume: string
  label: React.ReactNode
  currency?: string
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  volume,
  label,
  currency,
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, className, modeClass[colorThemeMode])}>
      <h4 className={s.header}>
        {label}
      </h4>
      <CurrencyAmount
        amount={volume}
        currency={currency}
        isRightCurrency={currency === '$'}
        labelSize="large"
      />
    </div>
  );
};
