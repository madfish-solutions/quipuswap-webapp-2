import { FC } from 'react';

import { useToasts } from '@hooks/use-toasts';

import { ErrorBoundaryProps } from './error-boundary.types';
import { ErrorBoundaryInner } from './error-boundary-inner';

export const ErrorBoundary: FC<ErrorBoundaryProps> = ({ isError, fallback }) => {
  const { showErrorToast } = useToasts();

  return <ErrorBoundaryInner showErrorToast={showErrorToast} isError={isError} fallback={fallback} />;
};
