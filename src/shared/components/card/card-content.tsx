import { FC } from 'react';

import cx from 'classnames';

import styles from './card.module.scss';

interface CardContentProps {
  className?: string;
}

export const CardContent: FC<CardContentProps> = ({ className, children }) => (
  <div className={cx(styles.content, className)}>{children}</div>
);
