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
  StartAdornment?: React.FC<{ className?: string }>
  EndAdornment?: React.FC<{ className?: string }>
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
  label,
  id,
  error,
  StartAdornment,
  EndAdornment,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [focused, setActive] = React.useState<boolean>(false);

  const compoundClassName = cx(
    s.root,
    { [s.start]: StartAdornment!! },
    { [s.end]: EndAdornment!! },
    { [s.error]: error!! },
    { [s.focused]: focused },
    { [s.disabled]: disabled },
    modeClass[colorThemeMode],
    sizeClass[inputSize],
    className,
  );

  return (
    <div className={compoundClassName}>
      {label && (
        <label htmlFor={id} className={s.label}>
          {label}
        </label>
      )}
      <div className={s.background}>
        {StartAdornment!! && (
          <StartAdornment className={s.adornment} />
        )}
        <input
          disabled={disabled}
          id={id}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          className={s.input}
          {...props}
        />
        {EndAdornment!! && (
          <EndAdornment className={s.adornment} />
        )}
      </div>
      <div className={s.errorContainer}>
        <p className={cx(s.errorLabel)}>
          {error}
        </p>
      </div>
    </div>
  );
};
