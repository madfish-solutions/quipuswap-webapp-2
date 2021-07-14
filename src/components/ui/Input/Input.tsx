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
  endAdornment?:React.ReactNode
  startAdornment?:React.ReactNode
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
  endAdornment,
  startAdornment,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [isActive, setActive] = React.useState<boolean>(false);

  const compoundClassName = cx(
    s.inputBaseWrapper,
    error && s.inputBaseError,
    isActive && !disabled && !readonly && s.inputBaseActive,
    disabled && s.inputBaseDisabled,
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
        <div className={s.inputBase}>
          {startAdornment && (
          <div className={cx(s.adornment, s.startAdornment)}>
            {startAdornment}
          </div>
          )}
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
          {endAdornment && (
          <div className={cx(s.adornment, s.endAdornment)}>
            {endAdornment}
          </div>
          )}

        </div>
      </div>
      {error && (
      <div className={cx(s.caption, s.inputError)}>
        {error}
      </div>
      )}
    </div>
  );
};
