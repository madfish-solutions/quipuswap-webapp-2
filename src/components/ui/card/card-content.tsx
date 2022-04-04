import { FC } from 'react';

import cx from 'classnames';

import styles from './card.module.scss';

interface Props {
  className?: string;
}

export const CardContent: FC<Props> = ({ className, children }) => (
  <div className={cx(styles.content, className)}>{children}</div>
);
