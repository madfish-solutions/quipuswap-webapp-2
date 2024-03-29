import { FC, FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { Nullable } from '@shared/types';

import { getOnlyDecimals } from './utils';
import { Input, InputProps } from '../input';

export interface AssetInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value: Nullable<number | string>;
  min?: number;
  max?: number;
  assetSymbol?: ReactNode;
  assetDecimals?: number;
  onChange?: (value: Nullable<string>) => void;
}

/**
 * The same logic as in the Template
 * https://github.com/madfish-solutions/templewallet-extension/blob/develop/src/app/atoms/AssetField.tsx
 */

export const AssetInput: FC<AssetInputProps> = ({
  value,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  assetSymbol,
  assetDecimals = 6,
  onChange,
  onFocus,
  onBlur,
  ...props
}) => {
  const valueStr = useMemo(() => (value === null ? '' : new BigNumber(value).toFixed()), [value]);
  const [localValue, setLocalValue] = useState(valueStr);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setLocalValue(valueStr);
    }
  }, [setLocalValue, focused, valueStr]);

  const handleFocus = (evt: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(evt);
  };

  const handleBlur = (evt: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(evt);
  };

  const handleChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      let val = getOnlyDecimals((event.target as HTMLInputElement).value);
      let numVal = new BigNumber(val || 0);
      const indexOfDot = val.indexOf('.');
      if (indexOfDot !== -1 && val.length - indexOfDot > assetDecimals + 1) {
        val = val.substring(0, indexOfDot + assetDecimals + 1);
        numVal = new BigNumber(val);
      }

      if (!numVal.isNaN() && numVal.isGreaterThanOrEqualTo(min) && numVal.isLessThanOrEqualTo(max)) {
        setLocalValue(val);
        if (onChange) {
          onChange(val !== '' ? numVal.toFixed() : null);
        }
      }
    },
    [assetDecimals, setLocalValue, min, max, onChange]
  );

  return (
    <Input
      onChange={handleChange}
      value={localValue}
      type="text"
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
};
