import React, { useContext } from 'react';
import cx from 'classnames';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './Bage.module.sass';

type BageProps = {
  className?: string,
  innerClassName?: string,
  text: string,
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Bage: React.FC<BageProps> = ({
  className,
  innerClassName,
  text,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(modeClass[colorThemeMode], s.bageBorder, className)}>
      <div className={cx(s.bage, innerClassName)}>
        {text}
      </div>
    </div>
  );
};
