import React from 'react';
import cx from 'classnames';

import s from './Card.module.sass';

type CardContentProps = {
  className?: string
};
export const CardContent: React.FC<CardContentProps> = ({
  className,
  children,
}) => (
  <div className={cx(s.content, className)}>
    {children}
  </div>
);
