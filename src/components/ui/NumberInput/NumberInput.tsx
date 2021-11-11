import React, { forwardRef } from 'react';
import cx from 'classnames';

import PlusIcon from '@icons/TopArrow.svg';
import MinusIcon from '@icons/BotArrow.svg';

import { Input, InputProps } from '../Input';
import s from './NumberInput.module.sass';

const themeClass = {
  small: s.small,
  medium: s.medium,
};

type NumberInputProps = {
  theme?: keyof typeof themeClass
  onIncrementClick?: () => void
  onDecrementClick?: () => void
  placeholder?: string
  labelClassName?: string
  disabled?: boolean
} & InputProps;

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(({
  theme = 'small',
  className,
  labelClassName,
  onIncrementClick,
  onDecrementClick,
  disabled,
  ...props
}, ref) => (
  <div className={cx(s.root, themeClass[theme], className)}>
    <Input
      type="number"
      ref={ref}
      className={cx(s.wrapper)}
      labelClassName={cx(s.label, labelClassName)}
      disabled={disabled}
      inputClassName={s.input}
      {...props}
    />
    <div className={s.buttons}>
      <button
        type="button"
        className={s.button}
        onMouseDown={onIncrementClick}
        disabled={disabled || !onIncrementClick}
      >
        <PlusIcon className={s.icon} />
      </button>
      <button
        type="button"
        className={s.button}
        onMouseDown={onDecrementClick}
        disabled={disabled || !onDecrementClick}
      >
        <MinusIcon className={s.icon} />
      </button>
    </div>
  </div>
));
