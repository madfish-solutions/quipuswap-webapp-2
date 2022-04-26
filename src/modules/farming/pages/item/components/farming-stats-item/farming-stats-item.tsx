import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { DashPlug, Tooltip } from '@shared/components';
import { isNull } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';

import styles from './farming-stats-item.module.scss';

export interface FarmingStatsItemProps {
  itemName: string;
  loading: boolean;
  tooltipContent: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const FarmingStatsItem: FC<FarmingStatsItemProps> = ({
  itemName,
  children,
  loading,
  tooltipContent,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { accountPkh } = useAuthStore();

  const content =
    isNull(accountPkh) || isNull(children) ? <DashPlug animation={loading} className={styles.dash} /> : children;

  return (
    <div className={cx(modeClass[colorThemeMode], styles.item)} {...props}>
      <span className={styles.header}>
        <span data-test-id="farmingStatsItemName">{itemName}</span>
        <Tooltip content={tooltipContent} />
      </span>
      <div className={styles.value}>{content}</div>
    </div>
  );
};
