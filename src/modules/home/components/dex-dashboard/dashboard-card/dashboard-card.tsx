import { FC, ReactNode, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { StateCurrencyAmount } from '@shared/components/state-components';
import { Tooltip } from '@shared/components/ui';
import { Nullable } from '@shared/types/types';

import s from './dashboard-card.module.sass';

interface DashboardCardProps {
  volume: Nullable<string>;
  size?: 'large' | 'extraLarge';
  label: ReactNode;
  currency?: string;
  tooltip?: string;
  className?: string;
  loading?: boolean;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const DashboardCard: FC<DashboardCardProps> = ({
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
        className={s.currencyAmount}
        amount={volume}
        currency={currency}
        isLeftCurrency={currency === '$'}
        labelSize={size}
      />
    </div>
  );
};
