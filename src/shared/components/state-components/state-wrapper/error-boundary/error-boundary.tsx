import * as Sentry from '@sentry/react';

import { CFC } from '@shared/types';
import { useToasts } from '@shared/utils';

import { ErrorBoundaryProps } from './error-boundary.types';

export const ErrorBoundary: CFC<ErrorBoundaryProps> = ({ fallback, children }) => {
  const { showErrorToast } = useToasts();

  return (
    <Sentry.ErrorBoundary fallback={fallback} onError={showErrorToast}>
      {children}
    </Sentry.ErrorBoundary>
  );
};
