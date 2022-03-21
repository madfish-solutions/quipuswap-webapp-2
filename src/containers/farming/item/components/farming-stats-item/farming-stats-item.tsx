import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { Tooltip } from '@components/ui/components/tooltip';
import { DashPlug } from '@components/ui/dash-plug';
import { useAuthStore } from '@hooks/stores/use-auth-store';
import { isNull } from '@utils/helpers';

import styles from './farming-stats-item.module.sass';

export interface FarmingStatsItemProps {
  itemName: string;
  loading: boolean;
  tooltipContent: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const FarmingStatsItem: FC<FarmingStatsItemProps> = ({ itemName, children, loading, tooltipContent }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { accountPkh } = useAuthStore();

  const content =
    isNull(accountPkh) || isNull(children) ? <DashPlug animation={loading} className={styles.dash} /> : children;

  return (
    <div className={cx(modeClass[colorThemeMode], styles.item)}>
      <span className={styles.header}>
        {itemName}
        <Tooltip content={tooltipContent} />
      </span>
      <div className={styles.value}>{content}</div>
    </div>
  );
};
