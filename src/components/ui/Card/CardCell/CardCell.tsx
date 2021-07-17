import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './CardCell.module.sass';

type CardCellProps = {
  header?: string
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const CardCell: React.FC<CardCellProps> = ({
  header,
  className,
  children,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <h6 className={s.header}>
        {header}
      </h6>
      {children}
    </div>
  );
};
