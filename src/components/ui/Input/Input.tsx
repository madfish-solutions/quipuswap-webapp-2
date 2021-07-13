/* eslint-disable react/button-has-type */
import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './Input.module.sass';

type InputProps = {
  disabled?: boolean
  readonly?: boolean
  className?: string
  label?: string
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
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(
    s.root,
  );
  const compoundBaseClassName = cx(
    modeClass[colorThemeMode],
    s.base,
    className,
  );
  return (
    <div className={compoundBaseClassName}>
      <div className={cx(s.label1, s.inputLabel)}>{label}</div>
      <input
        value={value}
        disabled={disabled}
        readOnly={readonly}
        type="text"
        {...(props as React.HTMLProps<HTMLInputElement>)}
        className={compoundClassName}
      />
    </div>
  );
};
