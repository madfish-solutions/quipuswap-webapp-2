import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import styles from './button.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props {
  label: string;
  className?: string;
  loading?: boolean;
}

export const ButtonUI: FC<Props> = ({ label, className, loading }: Props) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(className, styles.root, modeClass[colorThemeMode], {
    [styles.loading]: loading
  });

  return <button className={compoundClassName}>{label}</button>;
};
