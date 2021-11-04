import React, { useContext } from 'react';
import cx from 'classnames';
import { Skeleton } from '@madfish-solutions/quipu-ui-kit';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Tooltip } from '@components/ui/Tooltip';

import s from './DashboardCard.module.sass';

type DashboardCardProps = {
  volume: string
  size?: 'large' | 'extraLarge'
  label: React.ReactNode
  currency?: string
  tooltip?: string
  className?: string
  loading?: boolean
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
  tooltip,
  className,
  loading = false,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, className, modeClass[colorThemeMode])}>
      <h4 className={s.header}>
        {label}
        {' '}
        <Tooltip content={tooltip} />
      </h4>
      {loading ? <Skeleton className={s.skeleton} /> : (
        <CurrencyAmount
          amount={volume}
          currency={currency}
          isRightCurrency={currency === '$'}
          decimals={currency === '$' ? 3 : undefined}
          length={currency === '$' ? 6 : undefined}
          labelSize={size}
        />
      )}
    </div>
  );
};
