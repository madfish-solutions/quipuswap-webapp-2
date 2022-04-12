import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import styles from './bage.module.scss';

interface Props {
  className?: string;
  innerClassName?: string;
  text: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const Bage: FC<Props> = ({ className, innerClassName, text }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(modeClass[colorThemeMode], styles.bageBorder, className)}>
      <div className={cx(styles.bage, innerClassName)}>{text}</div>
    </div>
  );
};
