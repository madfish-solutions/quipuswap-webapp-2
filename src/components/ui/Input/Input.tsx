/* eslint-disable react/button-has-type */
import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './Input.module.sass';

type InputProps = {
  error?: string
  disabled?: boolean
  className?: string
  label?: string
  inputSize?: keyof typeof sizeClass
  endAdornment?:React.ReactNode
  startAdornment?:React.ReactNode
} & React.HTMLProps<HTMLInputElement>;

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
  disabled = false,
  className,
  label = '',
  error = '',
  id,
  endAdornment,
  startAdornment,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [focused, setActive] = React.useState<boolean>(false);

  const compoundStatefulClassName = cx(
    s.root,
    { [s.disabled]: disabled },
  );
  const compoundBaseClassName = cx(
    modeClass[colorThemeMode],
    sizeClass[inputSize],
    { [s.error]: error },
    { [s.focused]: focused },
    className,
  );
  return (
    <div className={compoundBaseClassName}>
      {label && (
        <label htmlFor={id} className={s.label1}>
          {label}
        </label>
      )}
      <div className={compoundStatefulClassName}>
        <div className={s.inputBase}>
          {startAdornment && (
          <div className={cx(s.adornment, s.start)}>
            {startAdornment}
          </div>
          )}
          <input
            disabled={disabled}
            id={id}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
            {...props}
            className={s.input}
          />
          {endAdornment && (
          <div className={cx(s.adornment, s.end)}>
            {endAdornment}
          </div>
          )}

        </div>
      </div>
      <div className={s.errorContainer}>
        <p className={cx(s.errorLabel)}>
          {error}
        </p>
      </div>
    </div>
  );
};
