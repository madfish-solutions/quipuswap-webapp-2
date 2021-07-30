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
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Card: React.FC<CardProps> = ({
  className,
  header,
  additional,
  contentClassName,
  footer,
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
      {additional && (
        <div className={s.additional}>
          {additional}
        </div>
      )}
      <div className={cx(s.content, contentClassName)}>
        {children}
      </div>
      {footer && (
        <div className={s.footer}>
          {footer}
        </div>
      )}
    </div>
  );
};
