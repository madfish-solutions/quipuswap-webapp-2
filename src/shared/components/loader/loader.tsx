import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import styles from './loader.module.scss';

export interface LoaderProps {
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const Loader: FC<LoaderProps> = ({ className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(styles['lds-ring'], modeClass[colorThemeMode], className);

  return (
    <div className={compoundClassName}>
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};
