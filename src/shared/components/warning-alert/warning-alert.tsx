import { FC } from 'react';

import cx from 'classnames';

import styles from './warning-alert.module.scss';

interface Props {
  message: Nullable<string>;
  className?: string;
}
export const WarningAlert: FC<Props> = ({ message, className }) => {
  if (!message) {
    return null;
  }

  return <div className={cx(styles.root, className)}>{message}</div>;
};
