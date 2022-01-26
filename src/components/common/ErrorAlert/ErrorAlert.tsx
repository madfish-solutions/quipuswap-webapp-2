import React from 'react';

import cx from 'classnames';

import s from './ErrorAlert.module.sass';

interface ConnectWalletButtonProps {
  className?: string;
  error: Error;
}

export const ErrorAlert: React.FC<ConnectWalletButtonProps> = ({ className, error }) => (
  <div className={cx(s.root, className)}>
    <h4 className={s.text}>Error</h4>
    <pre className={s.text}>{error.message}</pre>
  </div>
);
