import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { ActiveStatus } from '@shared/types';

import styles from './status-label.module.scss';

const gradients = {
  [ActiveStatus.ACTIVE]: 'linear-gradient(98deg, #5C1EE0 0%, #1373E4 100%)',
  // [StakeStatus.APPROVED]: '#2ED33E',
  [ActiveStatus.PENDING]: 'linear-gradient(98deg, #FF6B00 0%, #F9A605 100%)',
  // [StakeStatus.FAILED]: '#EA2424',
  // [StakeStatus.ACTIVATED]: '#A1A4B1',
  [ActiveStatus.DISABLED]: '#A1A4B1'
  // [StakeStatus.PAUSED]: 'linear-gradient(98deg, #FF6B00 0%, #F9A605 100%)'
};

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

export const StatusLabel: FC<Props> = ({ className, status, label, filled }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div
      className={cx(styles.container, themeClass[colorThemeMode], className)}
      style={{ background: gradients[status] }}
    >
      <span className={cx(styles.status, filled ? styles.filled : styles.bordered)}>{label ?? status}</span>
    </div>
  );
};
