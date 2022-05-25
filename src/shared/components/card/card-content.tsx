import cx from 'classnames';

import { CFC } from '@shared/types';

import styles from './card.module.scss';

interface CardContentProps {
  className?: string;
}

export const CardContent: CFC<CardContentProps> = ({ className, children }) => (
  <div className={cx(styles.content, className)}>{children}</div>
);
