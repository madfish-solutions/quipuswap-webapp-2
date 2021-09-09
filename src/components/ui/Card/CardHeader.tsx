import React from 'react';
import cx from 'classnames';

import s from './Card.module.sass';

type CardHeaderProps = {
  className?: string
  header: {
    content: React.ReactNode
    button?: React.ReactNode
  }
};
export const CardHeader: React.FC<CardHeaderProps> = ({
  header,
  className,
}) => (
  <div className={cx(s.header, className)}>
    {header.content}
    {header.button}
  </div>
);
