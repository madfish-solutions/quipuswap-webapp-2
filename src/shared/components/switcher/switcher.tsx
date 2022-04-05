import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

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
  const onToggle = () => {
    if (!disabled) {
      onClick(!value);
    }
  };

  return <div onClick={onToggle} className={compoundClassName}></div>;
};
