import React from 'react';
import cx from 'classnames';

import s from './Card.module.sass';

type CardAdditionalProps = {
  className?: string
};
export const CardAdditional: React.FC<CardAdditionalProps> = ({
  className,
  children,
}) => (
  <div className={cx(s.additional, className)}>
    {children}
  </div>
);
