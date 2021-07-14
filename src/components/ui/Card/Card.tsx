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
  contentClassName?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Card: React.FC<CardProps> = ({
  className,
  header,
  contentClassName,
  children,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      {header && (
        <div className={cx(s.header, header.className)}>
          {header.content}
          {header.button}
        </div>
      )}
      <div className={cx(s.content, contentClassName)}>
        {children}
      </div>
    </div>
  );
};
