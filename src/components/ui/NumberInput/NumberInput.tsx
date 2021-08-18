import React, {
  forwardRef, useCallback, useEffect, useMemo, useState,
} from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';

import { Input, InputProps } from '@components/ui/Input';
import PlusIcon from '@icons/TopArrow.svg';
import MinusIcon from '@icons/BotArrow.svg';

import s from './NumberInput.module.sass';

type NumberInputProps = {
  theme?: keyof typeof themeClass
  onIncrementClick?: () => void
  onDecrementClick?: () => void
  value?: BigNumber
  onChange?: (newValue?: BigNumber) => void
  decimals: number
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
  onChange,
  value,
  decimals,
  ...props
}, ref) => {
  const valueStr = useMemo(() => (value !== undefined ? value.toFixed() : ''), [value]);

  const [localValue, setLocalValue] = useState(valueStr);
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/ /g, '').replace(/,/g, '.');
    let numVal = new BigNumber(val || 0);
    const indexOfDot = val.indexOf('.');
    if (indexOfDot !== -1 && val.length - indexOfDot > decimals + 1) {
      val = val.substring(0, indexOfDot + decimals + 1);
      numVal = new BigNumber(val);
    }

    if (numVal.isNaN()) {
      return;
    }
    setLocalValue(val);
    onChange?.(val !== '' ? numVal : undefined);
  }, [onChange, decimals]);

  useEffect(() => setLocalValue(valueStr), [valueStr]);
  return (
    <div className={cx(s.root, themeClass[theme], className)}>
      <Input
        {...props}
        type="number"
        ref={ref}
        className={cx(s.wrapper)}
        labelClassName={cx(s.label, labelClassName)}
        disabled={disabled}
        inputClassName={s.input}
        onChange={handleChange}
        value={localValue}
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
  );
});
