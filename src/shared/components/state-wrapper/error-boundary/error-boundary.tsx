import { FC } from 'react';

import { useToasts } from '@shared/hooks/use-toasts';

import { ErrorBoundaryInner } from './error-boundary-inner';
import { ErrorBoundaryProps } from './error-boundary.types';

export const ErrorBoundary: FC<ErrorBoundaryProps> = ({ isError, fallback, children }) => {
  const { showErrorToast } = useToasts();

  return (
    <ErrorBoundaryInner showErrorToast={showErrorToast} isError={isError} fallback={fallback}>
      {children}
    </ErrorBoundaryInner>
  );
};
