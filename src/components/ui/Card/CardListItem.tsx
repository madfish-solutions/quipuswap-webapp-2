import React from 'react';
import s from './Card.module.sass';

export const CardListItem: React.FC<{}> = ({
  children,
}) => (
  <div className={s.cardListItem}>
    {children}
    <div className={s.hr} />
  </div>
);
