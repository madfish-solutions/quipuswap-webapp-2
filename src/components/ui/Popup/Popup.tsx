import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import cx from 'classnames';
import React, { useContext } from 'react';

import s from './Popup.module.sass';

type PopupProps = {
  className?: string,
  closeHandler?: () => void
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
        // do not pass closeHandler if u want implement blocking popup
        if (closeHandler) closeHandler();
      }}
      aria-hidden="true"
      className={cx(modeClass[colorThemeMode], s.popup, className)}
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
