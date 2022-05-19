import { FC } from 'react';

import s from './ComplexInput.module.scss';

interface ComplexErrorProps {
  error?: string;
}

export const ComplexError: FC<ComplexErrorProps> = ({ error, ...props }) => (
  <div className={s.errorContainer} {...props}>
    <p className={s.errorLabel}>{error}</p>
  </div>
);
