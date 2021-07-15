import React, { useContext } from 'react';
import Select, { Props as SelectProps } from 'react-select';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './Select.module.sass';

interface SelectUIProps extends SelectProps {
  className?: string
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const SelectUI: React.FC<SelectUIProps> = ({
  value,
  isSearchable = false,
  className,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <Select
        classNamePrefix="customSelect"
        isSearchable={isSearchable}
        value={value}
        {...props}
      />
    </div>
  );
};
