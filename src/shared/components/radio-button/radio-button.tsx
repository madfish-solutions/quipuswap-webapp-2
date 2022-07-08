import { FC, useContext } from 'react';

// import { Iterator } from '../iterator';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import { Iterator } from '../iterator';
import styles from './radio-button.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props {
  values: Array<RadioItemProps>;
  className?: string;
}

interface RadioItemProps {
  radioName: string;
  value: string;
  label: string;
}

const RadioItem: FC<RadioItemProps> = ({ radioName, value, label }) => (
  <label className={styles.label}>
    <input className={styles.input} type="radio" name={radioName} value={value} />
    <span>{label}</span>
  </label>
);

export const RadioButton: FC<Props> = ({ className, values }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div role="group" className={cx(modeClass[colorThemeMode], styles.radioButton, className)}>
      <Iterator render={RadioItem} data={values} />
    </div>
  );
};
