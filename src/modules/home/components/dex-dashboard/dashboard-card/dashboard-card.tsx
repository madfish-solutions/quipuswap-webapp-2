import { FC, ReactNode, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { StateCurrencyAmount } from '@shared/components/state-components';
import { Tooltip } from '@shared/components/tooltip';
import { Nullable } from '@shared/types/types';
import { DexDashboardTestAttribute } from '@tests/types';

import styles from './dashboard-card.module.scss';

interface DashboardCardProps extends DexDashboardTestAttribute {
  volume: Nullable<string>;
  size?: 'large' | 'extraLarge';
  label: ReactNode;
  currency?: string;
  tooltip?: string;
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
  className,
  tooltipTestId,
  currencyTestId,
  amountTestId,
  loading = false
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.root, className, modeClass[colorThemeMode])}>
      <h4 className={styles.header}>
        {label} <Tooltip content={tooltip} testId={tooltipTestId} />
      </h4>
      <StateCurrencyAmount
        className={styles.currencyAmount}
        amount={volume}
        currency={currency}
        isLeftCurrency={currency === '$'}
        labelSize={size}
        isLoading={loading}
        currencyTestId={currencyTestId}
        amountTestId={amountTestId}
      />
    </div>
  );
};
