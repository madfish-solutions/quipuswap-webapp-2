import { useContext, ReactNode } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { CFC } from '@shared/types';

import styles from './card-cell.module.scss';

interface Props {
  header?: ReactNode;
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const CardCell: CFC<Props> = ({ header, className, children, ...props }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(className, styles.root, modeClass[colorThemeMode])} {...props}>
      <h6 className={styles.header}>{header}</h6>
      {children}
    </div>
  );
};
