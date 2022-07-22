import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import styles from './hot-pool-lable.module.scss';

interface Props {
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const HotPoolLable: FC<Props> = ({ className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return <div className={cx(className, modeClass[colorThemeMode])}>Hot pool</div>;
};
