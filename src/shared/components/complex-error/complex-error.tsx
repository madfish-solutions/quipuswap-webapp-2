import { FC } from 'react';

import { DATA_TEST_ID_PROP_NAME } from '@config/constants';

import styles from './complex-error.module.scss';

export interface ComplexErrorProps {
  error?: string;
  [DATA_TEST_ID_PROP_NAME]?: string;
}

export const ComplexError: FC<ComplexErrorProps> = ({ error, ...props }) => (
  <div className={styles.errorContainer} {...props}>
    <p className={styles.errorLabel} data-test-id="errorLabel">
      {error}
    </p>
  </div>
);
