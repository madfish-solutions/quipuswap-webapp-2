import { ErrorBoundaryProps as SentryErrorBoundaryProps } from '@sentry/react';

import { isDev } from '@shared/helpers';
import { CFC } from '@shared/types';
import { useToasts } from '@shared/utils';

import { ErrorBoundaryInner } from './error-boundary-inner';
import { ErrorBoundaryProps } from './error-boundary.types';

const sentryProps: SentryErrorBoundaryProps = {
  showDialog: isDev(),
  onError: (error: Error, componentStack: string, eventId: string) =>
    // eslint-disable-next-line no-console
    console.error({ eventId, componentStack, error })
};

export const ErrorBoundary: CFC<ErrorBoundaryProps> = ({ isError, fallback, children }) => {
  const { showErrorToast } = useToasts();

  return (
    //@ts-ignore
    <ErrorBoundaryInner {...sentryProps} showErrorToast={showErrorToast} isError={isError} fallback={fallback}>
      {children}
    </ErrorBoundaryInner>
  );
};
