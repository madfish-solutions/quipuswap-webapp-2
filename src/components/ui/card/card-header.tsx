import React, { FC } from 'react';

import cx from 'classnames';

import styles from './card.module.scss';

interface Props {
  className?: string;
  header: {
    content: React.ReactNode;
    button?: React.ReactNode;
  };
}
export const CardHeader: FC<Props> = ({ header, className }) => (
  <div className={cx(styles.header, className)}>
    {header.content}
    {header.button}
  </div>
);
