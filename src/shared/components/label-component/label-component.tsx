import { FC, useContext } from 'react';

import cx from 'classnames';

import { FIRST_TUPLE_INDEX, SECOND_TUPLE_INDEX } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { ActiveStatus } from '@shared/types';

import styles from './label-component.module.scss';

export interface LabelComponentProps {
  className?: string;
  contentClassName?: string;
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

const OrLabel: FC<{ label: string | [string, string] }> = ({ label }) => {
  if (Array.isArray(label)) {
    return (
      <div className={styles.orLabelContainer}>
        {label[FIRST_TUPLE_INDEX]}
        <div className={styles.orLabel}>or</div>
        {label[SECOND_TUPLE_INDEX]}
      </div>
    );
  } else {
    return <>{label}</>;
  }
};

export const LabelComponent: FC<LabelComponentProps> = ({
  className,
  contentClassName,
  status,
  label,
  filled,
  DTI,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.container, themeClass[colorThemeMode], statusClass[status], className)} {...props}>
      <span
        className={cx(styles.status, filled ? styles.filled : styles.bordered, contentClassName)}
        data-test-id={DTI}
      >
        {label ? <OrLabel label={label} /> : status}
      </span>
    </div>
  );
};
