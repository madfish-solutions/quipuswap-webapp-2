import { FC, useContext, ReactNode } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import styles from './card-cell.module.scss';

interface Props {
  header?: ReactNode;
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const CardCell: FC<Props> = ({ header, className, children }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(className, styles.root, modeClass[colorThemeMode])}>
      <h6 className={styles.header}>{header}</h6>
      {children}
    </div>
  );
};
