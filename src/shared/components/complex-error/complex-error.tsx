import { FC } from 'react';

import styles from './complex-error.module.scss';

interface Props {
  error?: string;
}

export const ComplexError: FC<Props> = ({ error, ...props }) => (
  <div className={styles.errorContainer} {...props}>
    <p className={styles.errorLabel} data-test-id="errorLabel">
      {error}
    </p>
  </div>
);
