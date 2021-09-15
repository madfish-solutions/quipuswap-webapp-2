import React, { useContext } from 'react';
import cx from 'classnames';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './Card.module.sass';

type CardProps = {
  className?: string
  header?: {
    content: React.ReactNode
    button?: React.ReactNode
    className?: string
  }
  additional?: React.ReactNode
  footer?: React.ReactNode
  contentClassName?: string
  isV2?: boolean,
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Card: React.FC<CardProps> = ({
  className,
  children,
  isV2 = false,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  if (isV2) {
    return (
      <div className={cx(s.root, modeClass[colorThemeMode], className)}>
        {children}
      </div>
    );
  }
  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      {children}
    </div>
  );
};
