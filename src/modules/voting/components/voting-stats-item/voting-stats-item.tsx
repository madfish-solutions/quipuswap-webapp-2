import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { useAccountPkh } from '@providers/use-dapp';
import { Tooltip, DashPlug } from '@shared/components';
import { formatBalance, isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

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
  const accountPkh = useAccountPkh();

  const contentVallue =
    isNull(accountPkh) || isNull(value) ? (
      <DashPlug animation={Boolean(accountPkh)} className={styles.dash} />
    ) : (
      formatBalance(value)
    );

  return (
    <div className={cx(modeClass[colorThemeMode], styles.item)}>
      <span className={styles.header}>
        {itemName}
        :
        <Tooltip content={tooltip} />
      </span>
      <span className={styles.amount}>{contentVallue}</span>
    </div>
  );
};
