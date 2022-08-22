import * as Sentry from '@sentry/react';

import { CFC } from '@shared/types';
import { useToasts } from '@shared/utils';

import { ErrorBoundaryProps } from './error-boundary.types';

export const ErrorBoundary: CFC<ErrorBoundaryProps> = ({ fallback, children }) => {
  const { showErrorToast } = useToasts();

  const onError = (error: Error, componentStack: string, eventId: string) => {
    showErrorToast(error);
    // eslint-disable-next-line no-console
    console.error(eventId, error, componentStack);
  };

  return (
    <Sentry.ErrorBoundary fallback={fallback} onError={onError}>
      {children}
    </Sentry.ErrorBoundary>
  );
};
