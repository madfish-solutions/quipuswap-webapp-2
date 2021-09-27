import React, { useContext } from 'react';
import cx from 'classnames';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './Bage.module.sass';

type BageProps = {
  className?: string,
  variant?: 'inverse' | 'primary'
  innerClassName?: string,
  text: string,
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const themeClass = {
  primary: s.primary,
  inverse: s.inverse,
};

export const Bage: React.FC<BageProps> = ({
  className,
  variant = 'primary',
  innerClassName,
  text,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(
    modeClass[colorThemeMode],
    themeClass[variant],
    s.bageBorder,
    className,
  );
  return (
    <div className={compoundClassName}>
      <div className={cx(s.bage, innerClassName)}>
        {text}
      </div>
    </div>
  );
};
