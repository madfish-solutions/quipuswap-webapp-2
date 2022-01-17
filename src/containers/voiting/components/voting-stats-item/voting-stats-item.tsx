import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext, Nullable, Tooltip } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { DashPlug } from '@components/ui/dash-plug';
import { FormatNumber } from '@utils/formatNumber';

import styles from './voting-stats-item.module.scss';

export interface VotingStatsItemProps {
  value: Nullable<string>;
  itemName: string;
  tooltip: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const VotingStatsItem: FC<VotingStatsItemProps> = ({ value, itemName, tooltip }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(modeClass[colorThemeMode], styles.item)}>
      <span className={styles.header}>
        {itemName}
        :
        <Tooltip content={tooltip} />
      </span>
      <span className={styles.amount}>{value ? FormatNumber(value) : <DashPlug className={styles.dash} />}</span>
    </div>
  );
};
