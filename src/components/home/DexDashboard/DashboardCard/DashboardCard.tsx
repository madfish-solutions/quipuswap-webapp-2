import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { CurrencyAmount } from '@components/common/CurrencyAmount';

import s from './DashboardCard.module.sass';

type DashboardCardProps = {
  volume: string
  size?: keyof typeof sizeClass
  label: React.ReactNode
  units?: string
  className?: string
};

const sizeClass = {
  large: s.large,
  extraLarge: s.extraLarge,
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const DashboardCard: React.FC<DashboardCardProps> = ({
  volume,
  size = 'large',
  label,
  units,
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, className, sizeClass[size], modeClass[colorThemeMode])}>
      <h4 className={s.header}>{label}</h4>
      <div className={s.currency}>
        <CurrencyAmount amount={volume} currency="$" isRightCurrency labelSize={size} />
        {units && <span className={s.units}>{` ${units}`}</span>}
      </div>
    </div>
  );
};
