import { FC } from 'react';

import styles from './complex-error.module.scss';

interface Props {
  error?: string;
}

export const ComplexError: FC<Props> = ({ error }) => (
  <div className={styles.errorContainer}>
    <p className={styles.errorLabel}>{error}</p>
  </div>
);
