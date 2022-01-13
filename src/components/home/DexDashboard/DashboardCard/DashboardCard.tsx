import React, { useContext } from 'react';

import { ColorModes, ColorThemeContext, Skeleton, Tooltip } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { Nullable } from '@utils/types';

import s from './DashboardCard.module.sass';

interface DashboardCardProps {
  volume: Nullable<string>;
  size?: 'large' | 'extraLarge';
  label: React.ReactNode;
  currency?: string;
  tooltip?: string;
  className?: string;
  loading?: boolean;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const DashboardCard: React.FC<DashboardCardProps> = ({
  volume,
  size = 'large',
  label,
  currency,
  tooltip,
  className,
  loading = false
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, className, modeClass[colorThemeMode])}>
      <h4 className={s.header}>
        {label} <Tooltip content={tooltip} />
      </h4>
      <StateCurrencyAmount
        amount={volume}
        currency={currency!}
        loaderFallback={<Skeleton className={s.skeleton} />}
        isLeftCurrency={currency === '$'}
        labelSize={size}
      />
    </div>
  );
};
