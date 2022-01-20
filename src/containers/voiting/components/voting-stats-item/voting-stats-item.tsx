import { FC, Fragment, useContext } from 'react';

import { ColorModes, ColorThemeContext, Nullable, Tooltip } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { DashPlug } from '@components/ui/dash-plug';
import { FormatNumber } from '@utils/formatNumber';
import { formatBalance, isNull } from '@utils/helpers';

import styles from './voting-stats-item.module.scss';

export interface VotingStatsItemProps {
  value: Nullable<string>;
  itemName: string;
  tooltip: string;
  isLp?: boolean;
}

interface VotingStatsItemValueProps {
  value: Nullable<string>;
  isLp: Nullable<boolean>;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

const VotingStatsItemValue: FC<VotingStatsItemValueProps> = ({ value, isLp }) => {
  if (isNull(value)) {
    return <DashPlug className={styles.dash} />;
  }

  if (isLp) {
    return <Fragment>{formatBalance(value)}</Fragment>;
  } else {
    return <Fragment>{FormatNumber(value)}</Fragment>;
  }
};

export const VotingStatsItem: FC<VotingStatsItemProps> = ({ value, itemName, tooltip, isLp }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(modeClass[colorThemeMode], styles.item)}>
      <span className={styles.header}>
        {itemName}
        :
        <Tooltip content={tooltip} />
      </span>
      <span className={styles.amount}>
        <VotingStatsItemValue value={value} isLp={isLp ?? null} />
      </span>
    </div>
  );
};
