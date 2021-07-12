import React, { useContext } from 'react';
import cx from 'classnames';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './Card.module.sass';

type CardProps = {
  className?: string,
};

type CardHeaderProps = {
  title: string,
  icon?: React.ReactNode,
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Card: React.FC<CardProps> = ({
  className,
  children,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.card, modeClass[colorThemeMode], className)}>
      {children}
    </div>
  );
};

export const CardDivider: React.FC<{}> = () => (
  <div className={s.hr} />
);

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  icon,
}) => (
  <div className={s.cardHeader}>
    <h5>{title}</h5>
    {icon}
  </div>
);

export const CardContent: React.FC<{}> = ({
  children,
}) => (
  <div className={s.cardContent}>
    {children}
  </div>
);

export const CardList: React.FC<{}> = ({
  children,
}) => (
  <div className={s.cardList}>
    {children}
  </div>
);

export const CardListItem: React.FC<{}> = ({
  children,
}) => (
  <div className={s.cardListItem}>
    {children}
    <div className={s.hr} />
  </div>
);
