import { forwardRef } from 'react';

import { Input, InputProps } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { BotArrow } from '@components/svg/bot-arrow';
import { TopArrow } from '@components/svg/top-arrow';

import s from './number-input.module.scss';

export type NumberInputProps = {
  theme?: keyof typeof themeClass;
  onIncrementClick?: () => void;
  onDecrementClick?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-type-alias
} & InputProps;

const themeClass: { small: string; medium: string } = {
  small: s.small,
  medium: s.medium
};

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ theme = 'small', className, labelClassName, onIncrementClick, onDecrementClick, disabled, ...props }, ref) => (
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
          <TopArrow className={s.icon} />
        </button>
        <button
          type="button"
          className={s.button}
          onMouseDown={onDecrementClick}
          disabled={disabled || !onDecrementClick}
        >
          <BotArrow className={s.icon} />
        </button>
      </div>
    </div>
  )
);
