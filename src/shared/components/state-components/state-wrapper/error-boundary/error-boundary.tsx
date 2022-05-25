import { CFC } from '@shared/types';
import { useToasts } from '@shared/utils';

import { ErrorBoundaryInner } from './error-boundary-inner';
import { ErrorBoundaryProps } from './error-boundary.types';

export const ErrorBoundary: CFC<ErrorBoundaryProps> = ({ isError, fallback, children }) => {
  const { showErrorToast } = useToasts();

  return (
    <ErrorBoundaryInner showErrorToast={showErrorToast} isError={isError} fallback={fallback}>
      {children}
    </ErrorBoundaryInner>
  );
};
