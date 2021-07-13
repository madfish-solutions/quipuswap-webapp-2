import React from 'react';
import s from './Card.module.sass';

type CardHeaderProps = {
  title: React.ReactNode,
  icon?: React.ReactNode,
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  icon,
}) => (
  <div className={s.cardHeader}>
    {title}
    {icon}
  </div>
);
