import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './Input.module.sass';

export type InputProps = {
  error?: string
  disabled?: boolean
  active?: boolean
  className?: string
  label?: string
  labelClassName?: string
  inputClassName?: string
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
  active = false,
  className,
  label,
  labelClassName,
  inputClassName,
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
    { [s.start]: !!StartAdornment },
    { [s.end]: !!EndAdornment },
    { [s.error]: !!error },
    { [s.focused]: focused || active },
    { [s.disabled]: disabled },
    modeClass[colorThemeMode],
    sizeClass[inputSize],
    className,
  );

  return (
    <div className={compoundClassName}>
      {label && (
        <label htmlFor={id} className={cx(labelClassName, s.label)}>
          {label}
        </label>
      )}
      <div className={s.background}>
        {!!StartAdornment && (
          <StartAdornment className={s.adornment} />
        )}
        <input
          {...props}
          disabled={disabled}
          id={id}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          className={cx(s.input, inputClassName)}
        />
        {!!EndAdornment && (
          <EndAdornment className={s.adornment} />
        )}
      </div>
      <div className={s.errorContainer}>
        <p className={s.errorLabel}>
          {error}
        </p>
      </div>
    </div>
  );
};
