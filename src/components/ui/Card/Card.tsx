import React, { useContext } from 'react';
import cx from 'classnames';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './Card.module.sass';

type CardProps = {
  className?: string,
  content: React.ReactNode,
  button?: React.ReactNode,
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Card: React.FC<CardProps> = ({
  className,
  content,
  button,
  children,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.card, modeClass[colorThemeMode], className)}>
      <div className={s.cardHeader}>
        {content}
        {button}
      </div>
      <div className={s.cardList}>
        {children}

      </div>
    </div>
  );
};
