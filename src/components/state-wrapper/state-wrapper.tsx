import { FC, ReactElement, Suspense } from 'react';

import { ErrorBoundary } from './error-boundary/error-boundary';

export interface StateWrapperProps {
  isLoading?: boolean;
  loaderFallback: ReactElement;
  isError?: boolean;
  errorFallback?: ReactElement;
}

export const StateWrapper: FC<StateWrapperProps> = ({
  children,
  isLoading,
  loaderFallback,
  isError,
  errorFallback
}) => {
  if (isError) {
    return errorFallback!;
  }

  if (isLoading) {
    return loaderFallback;
  }

  return (
    <ErrorBoundary isError={isError} fallback={errorFallback ?? <></>}>
      <Suspense fallback={loaderFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
};
