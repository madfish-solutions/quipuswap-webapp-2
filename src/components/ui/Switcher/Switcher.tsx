import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import s from './Switcher.module.sass';

type SwitcherProps = {
  isActive: boolean
  onChange: (state: boolean) => void
  disabled?: boolean
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Switcher: React.FC<SwitcherProps> = ({
  isActive,
  onChange,
  disabled,
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(
    s.root,
    modeClass[colorThemeMode],
    { [s.active]: isActive },
    { [s.disabled]: disabled },
    className,
  );

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className={compoundClassName}>
      <input
        type="checkbox"
        className={s.input}
        checked={isActive}
        disabled={disabled}
        onClick={() => onChange(!isActive)}
      />
    </label>
  );
};
