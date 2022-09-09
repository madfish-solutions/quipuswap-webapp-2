import { ReactElement, Suspense } from 'react';

import { CFC } from '@shared/types';

import { ErrorBoundary } from './error-boundary';

export interface StateWrapperProps {
  isLoading?: boolean;
  loaderFallback: ReactElement;
  isError?: boolean;
  errorFallback?: ReactElement;
}

export const StateWrapper: CFC<StateWrapperProps> = ({
  children,
  isLoading,
  loaderFallback,
  isError,
  errorFallback
}) => {
  if (isError) {
    return errorFallback ?? null;
  }

  if (isLoading) {
    return loaderFallback;
  }

  return (
    <ErrorBoundary fallback={errorFallback ?? <></>}>
      <Suspense fallback={loaderFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
};
