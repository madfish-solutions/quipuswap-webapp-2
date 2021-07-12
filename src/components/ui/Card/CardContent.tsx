import React from 'react';
import s from './Card.module.sass';

export const CardContent: React.FC<{}> = ({
  children,
}) => (
  <div className={s.cardContent}>
    {children}
  </div>
);
