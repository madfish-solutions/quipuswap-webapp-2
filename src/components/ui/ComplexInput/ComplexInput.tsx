import cx from 'classnames';
import React, { useContext } from 'react';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './Bage.module.sass';

type ComplexInputProps = {
  className?: string,
  balance?: string,
  label?:string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const ComplexInput: React.FC<ComplexInputProps> = ({
  className,
  balance,
  label,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(modeClass[colorThemeMode], className)}>
      <div className={s.label}>{label}</div>
      <div className={s.bage}>
        {balance}
      </div>
    </div>
  );
};
