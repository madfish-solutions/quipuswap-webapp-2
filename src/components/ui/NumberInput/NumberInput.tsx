import React, { forwardRef } from 'react';
import cx from 'classnames';

import { Input, InputProps } from '@components/ui/Input';

import PlusIcon from '@icons/TopArrow.svg';
import MinusIcon from '@icons/BotArrow.svg';

import s from './NumberInput.module.sass';

type NumberInputProps = {
  theme?: keyof typeof themeClass
  onIncrementClick?: () => void
  onDecrementClick?: () => void
} & InputProps;

const themeClass = {
  small: s.small,
  medium: s.medium,
};

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
      {...props}
    />
    <div className={s.buttons}>
      <button
        type="button"
        className={s.button}
        onMouseDown={onIncrementClick}
        disabled={disabled}
      >
        <PlusIcon className={s.icon} />
      </button>
      <button
        type="button"
        className={s.button}
        onMouseDown={onDecrementClick}
        disabled={disabled}
      >
        <MinusIcon className={s.icon} />
      </button>
    </div>
  </div>
));
