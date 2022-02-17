import React, { useContext, Dispatch, SetStateAction, FC } from 'react';

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

const DEFAULT_PLACEHOLDER = 'CUSTOM';
const INPUT = 'input';
const MAX_UNIT_VISIBLE_LENGTH = 3;

export const NewPresetsAmountInput: FC<Props> = ({
  className,
  value,
  handleChange,
  activeButton,
  setActiveButton,
  decimals,
  min,
  max,
  placeholder = DEFAULT_PLACEHOLDER,
  presets,
  unit
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const handleCustomValueChange = (val: Nullable<string>) => handleChange(val);

  const handlePresetClick = (index: number, value: Nullable<string>, label: string) => {
    setActiveButton(index.toString());
    handleCustomValueChange(null);
    handleChange(value ?? label);
  };

  const handleAssetInputChange = (val: Nullable<string>) => {
    setActiveButton(INPUT);
    handleCustomValueChange(val);
  };

  const isInputActive = activeButton === INPUT;

  const wrapUnit = !value || value.toFixed().length < MAX_UNIT_VISIBLE_LENGTH ? unit : null;

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <div className={s.buttons}>
        {presets.map(({ label, value }, index) => (
          <button
            key={label}
            type="button"
            className={cx(s.button, { [s.active]: index === Number(activeButton) })}
            onClick={() => handlePresetClick(index, value, label)}
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
          active={isInputActive}
          min={min}
          max={max}
          onChange={handleAssetInputChange}
        />
        {unit && <span className={s.unit}>{wrapUnit}</span>}
      </div>
    </div>
  );
};
