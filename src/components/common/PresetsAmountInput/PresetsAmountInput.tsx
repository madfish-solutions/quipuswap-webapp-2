import React, { useContext, useState, useCallback } from 'react';

import { AssetInput, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { Nullable } from '@utils/types';

import s from './PresetsAmountInput.module.sass';

interface AmountPreset {
  label: string;
  value?: string;
}

export interface PresetsAmountInputProps {
  className?: string;
  decimals?: number;
  defaultValue: Nullable<string>;
  min?: number;
  max?: number;
  handleChange: (value: Nullable<string>) => void;
  placeholder?: string;
  presets: AmountPreset[];
  unit?: string;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const PresetsAmountInput: React.FC<PresetsAmountInputProps> = ({
  className,
  decimals,
  defaultValue,
  min,
  max,
  handleChange,
  placeholder = 'CUSTOM',
  presets,
  unit
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const presetMatchesDefaultValue = ({ label, value = label }: AmountPreset) => defaultValue === value;
  const shouldMakePresetActive = presets.some(presetMatchesDefaultValue);
  const defaultActiveButton = shouldMakePresetActive ? presets.findIndex(presetMatchesDefaultValue) : 'input';
  const defaultCustomValue = shouldMakePresetActive ? null : defaultValue;

  const [activeButton, setActiveButton] = useState<number | 'input'>(defaultActiveButton);
  const [customValue, setCustomValue] = useState(defaultCustomValue);

  const handleCustomValueChange = useCallback(
    (val: Nullable<string>) => {
      setCustomValue(val);
      handleChange(val);
    },
    [handleChange]
  );

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <div className={s.buttons}>
        {presets.map(({ label, value = label }, index) => (
          <button
            key={label}
            type="button"
            className={cx(s.button, { [s.active]: index === activeButton })}
            onClick={() => {
              setActiveButton(index);
              handleCustomValueChange(null);
              handleChange(value);
            }}
          >
            <span className={s.buttonInner}>{label}</span>
          </button>
        ))}
        <AssetInput
          assetDecimals={decimals}
          inputClassName={s.customInput}
          inputSize="small"
          placeholder={placeholder}
          value={customValue}
          active={activeButton === 'input'}
          min={min}
          max={max}
          onChange={val => {
            setActiveButton('input');
            handleCustomValueChange(val);
          }}
        />
        {unit && <span className={s.unit}>{unit}</span>}
      </div>
    </div>
  );
};
