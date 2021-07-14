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
  inputSize?: keyof typeof sizeClass
  endAdornment?:React.ReactNode
  startAdornment?:React.ReactNode
} & (
  | React.HTMLProps<HTMLInputElement>
);

const sizeClass = {
  medium: s.medium,
  small: s.small,
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Input: React.FC<InputProps> = ({
  inputSize = 'medium',
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

  const compoundStatefulClassName = cx(
    s.root,
    error && s.error,
    isActive && !disabled && !readonly && s.active,
    disabled && s.disabled,
  );
  const compoundBaseClassName = cx(
    modeClass[colorThemeMode],
    sizeClass[inputSize],
    className,
  );
  return (
    <div className={compoundBaseClassName}>
      {label && <div className={cx(s.label1, s.label)}>{label}</div>}
      <div className={compoundStatefulClassName}>
        <div className={s.inputBase}>
          {startAdornment && (
          <div className={cx(s.adornment, s.start)}>
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
            className={s.input}
          />
          {endAdornment && (
          <div className={cx(s.adornment, s.end)}>
            {endAdornment}
          </div>
          )}

        </div>
      </div>
      {error && (
      <div className={cx(s.caption, s.errorLabel)}>
        {error}
      </div>
      )}
    </div>
  );
};
