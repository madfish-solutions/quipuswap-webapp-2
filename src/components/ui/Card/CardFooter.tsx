import React from 'react';

import s from './Card.module.sass';

export const CardFooter: React.FC<{}> = ({ children }) => (
  <div className={s.footer}>{children}</div>
);
