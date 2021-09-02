import React from 'react';
import cx from 'classnames';

import s from './Card.module.sass';

type CardFooterProps = {
  className?: string
};
export const CardFooter: React.FC<CardFooterProps> = ({
  className,
  children,
}) => (
  <div className={cx(s.footer, className)}>
    {children}
  </div>
);
