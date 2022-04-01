import { useContext, useState, FocusEvent, HTMLProps, FC } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import s from './Input.module.scss';

export type InputProps = {
  error?: string;
  disabled?: boolean;
  active?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  labelClassName?: string;
  inputClassName?: string;
  inputSize?: keyof typeof sizeClass;
  StartAdornment?: FC<{ className?: string }>;
  EndAdornment?: FC<{ className?: string }>;
} & HTMLProps<HTMLInputElement>;

const sizeClass = {
  medium: s.medium,
  small: s.small
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const Input: FC<InputProps> = ({
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
  onBlur,
  onFocus,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [focused, setActive] = useState<boolean>(false);

  const compoundClassName = cx(
    s.root,
    { [s.start]: !!StartAdornment },
    { [s.end]: !!EndAdornment },
    { [s.error]: !!error },
    { [s.focused]: focused || active },
    { [s.disabled]: disabled },
    modeClass[colorThemeMode],
    sizeClass[inputSize],
    className
  );

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setActive(true);
    onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setActive(false);
    onBlur?.(e);
  };

  return (
    <div className={compoundClassName}>
      {label && (
        <label htmlFor={id} className={cx(labelClassName, s.label)}>
          {label}
        </label>
      )}
      <div className={s.background}>
        {!!StartAdornment && <StartAdornment className={s.adornment} />}
        <input
          {...props}
          disabled={disabled}
          id={id}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cx(s.input, inputClassName)}
          autoComplete="off"
        />
        {!!EndAdornment && <EndAdornment className={s.adornment} />}
      </div>
      <div className={s.errorContainer}>
        <p className={cx(s.errorLabel)}>{error}</p>
      </div>
    </div>
  );
};
