import { FC, ReactElement, Suspense } from 'react';
import { ErrorBoundary } from './error-boundary';

export interface StateWrapperProps {
  isLoading?: boolean;
  fallback: ReactElement;
}

export const StateWrapper: FC<StateWrapperProps> = ({ children, isLoading, fallback }) => {

  if (isLoading) {
    return fallback;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
};
