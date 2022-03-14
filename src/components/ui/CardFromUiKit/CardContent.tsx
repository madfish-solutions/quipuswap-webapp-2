import { FC } from 'react';

import cx from 'classnames';

import s from './Card.module.sass';

interface CardContentProps {
  className?: string;
}

export const CardContent: FC<CardContentProps> = ({ className, children }) => (
  <div className={cx(s.content, className)}>{children}</div>
);
