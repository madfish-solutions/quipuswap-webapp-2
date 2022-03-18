import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import styles from './switcher.module.scss';
import { useSwitcherViewModel } from './switcher.vm';

interface Props {
  onChange: (state: boolean) => void;
  disabled?: boolean;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const Switcher: FC<Props> = ({ onChange, disabled }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { state, handleClick } = useSwitcherViewModel();

  const compoundClassName = cx(modeClass[colorThemeMode], styles.switcher, {
    [styles.active]: Boolean(state),
    [styles.disabled]: Boolean(disabled)
  });

  const onClick = () => {
    if (!disabled) {
      handleClick(onChange);
    }
  };

  return <div onClick={onClick} className={compoundClassName}></div>;
};
