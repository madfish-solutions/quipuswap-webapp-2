import React from 'react';

import s from './Card.module.sass';

export const CardAdditional: React.FC<{}> = ({
  children,
}) => (
  <div className={s.additional}>
    {children}
  </div>
);
