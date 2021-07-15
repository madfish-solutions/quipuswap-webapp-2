import React from 'react';

import s from './ComplexInput.module.sass';

type ComplexErrorProps = {
  error?: string,
};

export const ComplexError: React.FC<ComplexErrorProps> = ({
  error,
}) => (
  <div className={s.errorContainer}>
    <p className={s.errorLabel}>
      {error}
    </p>
  </div>
);
