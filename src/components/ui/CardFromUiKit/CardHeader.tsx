import { FC, ReactNode } from 'react';

import cx from 'classnames';

import s from './Card.module.sass';

interface CardHeaderProps {
  className?: string;
  header: {
    content: ReactNode;
    button?: ReactNode;
  };
}
export const CardHeader: FC<CardHeaderProps> = ({ header, className }) => (
  <div className={cx(s.header, className)}>
    {header.content}
    {header.button}
  </div>
);
