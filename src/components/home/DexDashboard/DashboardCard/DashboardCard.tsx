import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { CurrencyAmount } from '@components/common/CurrencyAmount';

import s from './DashboardCard.module.sass';

type DashboardCardProps = {
  volume: string
  size?: 'large' | 'extraLarge'
  label: React.ReactNode
  currency?: string
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const DashboardCard: React.FC<DashboardCardProps> = ({
  volume,
  size = 'large',
  label,
  currency,
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, className, modeClass[colorThemeMode])}>
      <h4 className={s.header}>{label}</h4>
      <CurrencyAmount
        amount={volume}
        currency={currency}
        isRightCurrency={currency === '$'}
        labelSize={size}
      />
    </div>
  );
};
