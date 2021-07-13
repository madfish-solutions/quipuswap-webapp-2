/* eslint-disable react/button-has-type */
import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './Input.module.sass';

type InputProps = {
  error?: string
  disabled?: boolean
  readonly?: boolean
  className?: string
  label?: string
  select?:boolean
} & (
  | React.HTMLProps<HTMLInputElement>
);

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Input: React.FC<InputProps> = ({
  value = '',
  disabled = false,
  className,
  readonly = false,
  label = '',
  error = '',
  select,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [isActive, setActive] = React.useState<boolean>(false);

  const compoundClassName = cx(
    s.inputBase,
    error && s.inputBaseError,
    isActive && !disabled && !readonly && s.inputBaseActive,
  );
  const compoundBaseClassName = cx(
    modeClass[colorThemeMode],
    s.base,
    className,
  );
  return (
    <div className={compoundBaseClassName}>
      <div className={cx(s.label1, s.inputLabel)}>{label}</div>
      <div className={compoundClassName}>
        <input
          value={value}
          disabled={disabled}
          readOnly={readonly}
          type="text"
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          {...(props as React.HTMLProps<HTMLInputElement>)}
          className={s.root}
        />
      </div>
      <div className={s.inputError}>
        {error}
      </div>
    </div>
  );
};
