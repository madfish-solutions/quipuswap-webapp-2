import { FC } from 'react';

import styles from './error-fallback.module.scss';
import { Nullable } from '../../types';

interface Props {
  error: Nullable<Error | string>;
}

export const ErrorFallback: FC<Props> = ({ error }) => {
  if (!error) {
    return null;
  }

  const message = typeof error === 'string' ? error : error.message;

  return (
    <div className={styles.errorFallback}>
      <h1>Error</h1>
      <p>{message}</p>
    </div>
  );
};
