import React from 'react';
import s from './Card.module.sass';

type CardHeaderProps = {
  title: string,
  icon?: React.ReactNode,
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  icon,
}) => (
  <div className={s.cardHeader}>
    <h5>{title}</h5>
    {icon}
  </div>
);
