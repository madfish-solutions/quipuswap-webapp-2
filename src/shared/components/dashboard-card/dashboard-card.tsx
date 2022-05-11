import { FC, ReactNode, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { StateCurrencyAmount } from '@shared/components/state-components';
import { Tooltip } from '@shared/components/tooltip';
import { Nullable } from '@shared/types/types';

import styles from './dashboard-card.module.scss';

interface DashboardCardProps {
  volume: Nullable<string>;
  size?: 'large' | 'extraLarge';
  label: ReactNode;
  currency?: string;
  tooltip?: string;
  hideTooltip?: boolean;
  className?: string;
  loading?: boolean;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const DashboardCard: FC<DashboardCardProps> = ({
  volume,
  size = 'large',
  label,
  currency,
  tooltip,
  hideTooltip,
  className,
  loading = false,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.root, className, modeClass[colorThemeMode])} {...props}>
      <h4 className={styles.header}>
        {label} {!hideTooltip && <Tooltip content={tooltip} />}
      </h4>
      <StateCurrencyAmount
        className={styles.currencyAmount}
        amount={volume}
        currency={currency}
        isLeftCurrency={currency === '$'}
        labelSize={size}
        isLoading={loading}
        {...props}
      />
    </div>
  );
};
