import { useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { DashPlug, Tooltip } from '@shared/components';
import { isNull } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { CFC } from '@shared/types';

import styles from './stabledividends-stats-item.module.scss';

export interface StableDividendsStatsItemProps {
  itemName: string;
  loading: boolean;
  tooltipContent: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const StableDividendsStatsItem: CFC<StableDividendsStatsItemProps> = ({
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
        <span data-test-id="stableDividendsStatsItemName">{itemName}</span>
        <Tooltip content={tooltipContent} />
      </span>
      <div className={styles.value}>{content}</div>
    </div>
  );
};
