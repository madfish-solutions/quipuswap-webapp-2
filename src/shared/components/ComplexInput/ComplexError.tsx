import { FC } from 'react';

import s from './ComplexInput.module.scss';

interface ComplexErrorProps {
  error?: string;
}

export const ComplexError: FC<ComplexErrorProps> = ({ error }) => (
  <div className={s.errorContainer}>
    <p className={s.errorLabel}>{error}</p>
  </div>
);
