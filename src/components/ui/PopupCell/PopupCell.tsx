import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import cx from 'classnames';
import React, { useContext } from 'react';

import s from './PopupCell.module.sass';

type PopupCellProps = {
  className?: string,
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const PopupCell: React.FC<PopupCellProps> = ({
  className,
  children,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div
      className={cx(modeClass[colorThemeMode], s.popupCell, className)}
    >
      {children}
    </div>
  );
};
