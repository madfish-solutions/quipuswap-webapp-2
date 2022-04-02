import { useContext, Dispatch, SetStateAction, FC } from 'react';

import BigNumber from 'bignumber.js';
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
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

const DEFAULT_PLACEHOLDER = 'CUSTOM';
const INPUT = 'input';
const MAX_UNIT_VISIBLE_LENGTH = 3;

export const PresetsAmountInput: FC<Props> = ({
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
    <div className={cx(styles.root, modeClass[colorThemeMode], className)}>
      <div className={styles.buttons}>
        {presets.map(({ label, value }, index) => (
          <button
            key={label}
            type="button"
            className={cx(styles.button, { [styles.active]: index === Number(activeButton) })}
            onClick={() => handlePresetClick(index, value, label)}
          >
            <span className={styles.buttonInner}>{label}</span>
          </button>
        ))}
        <AssetInput
          assetDecimals={decimals}
          inputClassName={styles.customInput}
          inputSize="small"
          value={value.toFixed()}
          placeholder={placeholder}
          active={isInputActive}
          min={min}
          max={max}
          onChange={handleAssetInputChange}
        />
        {unit && <span className={styles.unit}>{wrapUnit}</span>}
      </div>
    </div>
  );
};
