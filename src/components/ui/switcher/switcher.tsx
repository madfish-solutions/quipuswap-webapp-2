import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import styles from './switcher.module.scss';

interface Props {
  onClick: (state: boolean) => void;
  value: boolean;
  disabled?: boolean;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const Switcher: FC<Props> = ({ onClick, disabled, value }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(modeClass[colorThemeMode], styles.switcher, {
    [styles.active]: Boolean(value),
    [styles.disabled]: Boolean(disabled)
  });

  return <div onClick={() => onClick(!value)} className={compoundClassName}></div>;
};
