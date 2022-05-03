import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { ActiveStatus } from '@shared/types';

import styles from './status-label.module.scss';

interface Props {
  className?: string;
  status: ActiveStatus;
  label?: string;
  filled?: boolean;
}

const themeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

const statusClass = {
  [ActiveStatus.PENDING]: styles.pending,
  [ActiveStatus.DISABLED]: styles.disabled,
  [ActiveStatus.ACTIVE]: styles.active
};

export const StatusLabel: FC<Props> = ({ className, status, label, filled, ...props }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.container, themeClass[colorThemeMode], statusClass[status], className)} {...props}>
      <span className={cx(styles.status, filled ? styles.filled : styles.bordered)}>{label ?? status}</span>
    </div>
  );
};
