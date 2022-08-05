import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import { Iterator } from '../iterator';
import styles from './radio-button.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export interface RadioButtonProps {
  values: Array<RadioItemProps>;
  onChange: (value: string) => void;
  value: string | number;
  className?: string;
}

interface RadioItemProps {
  radioName: string;
  value: string | number;
  label: string;
  checkedValue?: string | number;
}

const RadioItem: FC<RadioItemProps> = ({ radioName, value, label, checkedValue }) => (
  <label className={styles.label}>
    <input
      className={styles.input}
      type="radio"
      name={radioName}
      value={value}
      defaultChecked={value === checkedValue}
    />
    <span>{label}</span>
  </label>
);

export const RadioButton: FC<RadioButtonProps> = ({ className, values, onChange, value }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div
      role="group"
      //@ts-ignore
      onChange={event => onChange(event.target.value)}
      className={cx(modeClass[colorThemeMode], styles.radioButton, className)}
    >
      <Iterator render={RadioItem} data={values.map(obj => ({ ...obj, checkedValue: value }))} />
    </div>
  );
};
