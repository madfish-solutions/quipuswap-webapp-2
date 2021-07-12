import React from 'react';
import s from './Card.module.sass';

export const CardList: React.FC<{}> = ({
  children,
}) => (
  <div className={s.cardList}>
    {children}
  </div>
);
