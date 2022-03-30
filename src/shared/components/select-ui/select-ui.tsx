import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import Select, { Props as SelectProps } from 'react-select';

import styles from './select-ui.module.scss';

export interface SelectUIProps extends SelectProps {
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const SelectUI: FC<SelectUIProps> = ({ value, isSearchable = false, className, ...props }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.root, modeClass[colorThemeMode], className)}>
      <Select classNamePrefix="customSelect" isSearchable={isSearchable} value={value} {...props} />
    </div>
  );
};
