import { FC, ReactNode, useCallback, useEffect, useMemo, useState, FocusEvent } from 'react';

import BigNumber from 'bignumber.js';

import { Nullable } from '@shared/types';

import { Input, InputProps } from '../input';
import { getOnlyDecimals } from './utils';

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

const DEFAULT_MIN_VALUE = 0;
const DEFAULT_ASSET_DECIMALS = 6;
const ONE = 1;
const MINUS_ONE = -1;

export const AssetInput: FC<AssetInputProps> = ({
  value,
  min = DEFAULT_MIN_VALUE,
  max = Number.MAX_SAFE_INTEGER,
  assetSymbol,
  assetDecimals = DEFAULT_ASSET_DECIMALS,
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

  const handleFocus = (evt: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(evt);
  };

  const handleBlur = (evt: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(evt);
  };

  const handleChange = useCallback(
    evt => {
      let val = getOnlyDecimals(evt.target.value);
      let numVal = new BigNumber(val || DEFAULT_MIN_VALUE);
      const indexOfDot = val.indexOf('.');
      if (indexOfDot !== MINUS_ONE && val.length - indexOfDot > assetDecimals + ONE) {
        val = val.substring(DEFAULT_MIN_VALUE, indexOfDot + assetDecimals + ONE);
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
