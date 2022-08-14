import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { ActiveStatus } from '@shared/types';

import styles from './label-component.module.scss';

export interface LabelComponentProps {
  className?: string;
  status: ActiveStatus;
  label?: string | [string, string];
  filled?: boolean;
  DTI?: string;
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

const OrLabel: FC<{ label: [string, string] }> = ({ label }) => {
  return (
    <div className={styles.orLabelContainer}>
      {label[0]}
      <div className={styles.orLabel}>or</div>
      {label[1]}
    </div>
  );
};

export const LabelComponent: FC<LabelComponentProps> = ({ className, status, label, filled, DTI, ...props }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.container, themeClass[colorThemeMode], statusClass[status], className)} {...props}>
      <span className={cx(styles.status, filled ? styles.filled : styles.bordered)} data-test-id={DTI}>
        {label ? Array.isArray(label) ? <OrLabel label={label} /> : label : status}
      </span>
    </div>
  );
};
