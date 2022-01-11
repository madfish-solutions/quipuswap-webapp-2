import { FC } from 'react';

import { useToasts } from '@hooks/use-toasts';

import { ErrorBoundaryInner } from './error-boundary-inner';
import { ErrorBoundaryProps } from './error-boundary.types';

export const ErrorBoundary: FC<ErrorBoundaryProps> = ({ isError, fallback }) => {
  const { showErrorToast } = useToasts();

  return <ErrorBoundaryInner showErrorToast={showErrorToast} isError={isError} fallback={fallback} />;
};
