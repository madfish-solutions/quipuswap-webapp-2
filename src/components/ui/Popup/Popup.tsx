import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import cx from 'classnames';
import React, { useContext } from 'react';

import s from './Popup.module.sass';

type PopupProps = {
  className?: string,
  closeHandler: () => void
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Popup: React.FC<PopupProps> = ({
  className,
  children,
  closeHandler,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div
      onClick={() => {
        closeHandler();
      }}
      aria-hidden="true"
      className={cx(s.popup, modeClass[colorThemeMode], className)}
    >
      <div
        aria-hidden="true"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
};
