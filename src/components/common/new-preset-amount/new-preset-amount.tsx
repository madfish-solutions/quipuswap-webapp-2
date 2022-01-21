import React, { useContext, useCallback, Dispatch, SetStateAction } from 'react';

import { AssetInput, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { Nullable } from '@utils/types';

import s from '../PresetsAmountInput/PresetsAmountInput.module.sass';

interface AmountPreset {
  label: string;
  value: Nullable<string>;
}

interface Props {
  className?: string;
  value: BigNumber;
  handleChange: (newValue: Nullable<string>) => void;
  activeButton: string;
  setActiveButton: Dispatch<SetStateAction<string>>;
  decimals?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  presets: AmountPreset[];
  unit?: string;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const NewPresetsAmountInput: React.FC<Props> = ({
  className,
  value,
  handleChange,
  activeButton,
  setActiveButton,
  decimals,
  min,
  max,
  placeholder = 'CUSTOM',
  presets,
  unit
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const handleCustomValueChange = useCallback(
    (val: Nullable<string>) => {
      handleChange(val);
    },
    [handleChange]
  );

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <div className={s.buttons}>
        {presets.map(({ label, value }, index) => (
          <button
            key={label}
            type="button"
            className={cx(s.button, { [s.active]: index === +activeButton })}
            onClick={() => {
              setActiveButton(index.toString());
              handleCustomValueChange(null);
              handleChange(value ?? label);
            }}
          >
            <span className={s.buttonInner}>{label}</span>
          </button>
        ))}
        <AssetInput
          assetDecimals={decimals}
          inputClassName={s.customInput}
          inputSize="small"
          value={value.toFixed()}
          placeholder={placeholder}
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
