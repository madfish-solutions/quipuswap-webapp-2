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
  loading?: boolean;
  className?: string;
  stateCurrencyClassName?: string;
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
  loading = false,
  className,
  stateCurrencyClassName,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.root, className, modeClass[colorThemeMode])} {...props}>
      <h4 className={styles.header} data-test-id="dashboard-card-header">
        {label} {!hideTooltip && tooltip && <Tooltip content={tooltip} />}
      </h4>
      <StateCurrencyAmount
        className={cx(styles.currencyAmount, stateCurrencyClassName)}
        amount={volume}
        currency={currency}
        isLeftCurrency={currency === '$'}
        labelSize={size}
        isLoading={loading}
        maxAmountWithoutLetters={1e9}
        {...props}
      />
    </div>
  );
};
