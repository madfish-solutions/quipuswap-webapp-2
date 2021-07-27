import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import cx from 'classnames';
import React, { useContext } from 'react';

import s from './Bage.module.sass';

type BageProps = {
  className?: string,
  loading?: boolean,
  text: string,
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Bage: React.FC<BageProps> = ({
  className,
  loading = false,
  text,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(modeClass[colorThemeMode], s.bageBorder, className)}>
      <div className={cx(s.bage, loading ? s.loading : '')}>
        {text}
      </div>
    </div>
  );
};
