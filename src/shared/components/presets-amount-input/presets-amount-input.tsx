import { useContext, useState, useCallback, FC } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Nullable } from '@shared/types';

import { AssetInput } from '../asset-input';
import styles from './presets-amount-input.module.scss';

interface AmountPreset {
  label: string;
  value: Nullable<string>;
}

interface Props {
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
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

const INPUT_BUTTON_ID = 'input';
type ActiveButtonId = number | typeof INPUT_BUTTON_ID;
const MAX_UNIT_VISIBLE_LENGTH = 3;

export const PresetsAmountInput: FC<Props> = ({
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

  const presetMatchesDefaultValue = ({ label, value }: AmountPreset) =>
    defaultValue === value || defaultValue === label;
  const shouldMakePresetActive = presets.some(presetMatchesDefaultValue);
  const defaultActiveButton = shouldMakePresetActive ? presets.findIndex(presetMatchesDefaultValue) : 'input';
  const defaultCustomValue = shouldMakePresetActive ? null : defaultValue;

  const [activeButton, setActiveButton] = useState<ActiveButtonId>(defaultActiveButton);
  const [customValue, setCustomValue] = useState(defaultCustomValue);

  const handleCustomValueChange = useCallback(
    (val: Nullable<string>) => {
      setCustomValue(val);
      handleChange(val);
    },
    [handleChange]
  );

  const wrapUnit = !customValue || customValue.length < MAX_UNIT_VISIBLE_LENGTH ? unit : null;

  return (
    <div className={cx(styles.root, modeClass[colorThemeMode], className)}>
      <div className={styles.buttons}>
        {presets.map(({ label, value }, index) => (
          <button
            key={label}
            type="button"
            className={cx(styles.button, { [styles.active]: index === activeButton })}
            onClick={() => {
              setActiveButton(index);
              handleCustomValueChange(null);
              handleChange(value ?? label);
            }}
          >
            <span className={styles.buttonInner}>{label}</span>
          </button>
        ))}
        <AssetInput
          assetDecimals={decimals}
          inputClassName={styles.customInput}
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
        {unit && <span className={styles.unit}>{wrapUnit}</span>}
      </div>
    </div>
  );
};
