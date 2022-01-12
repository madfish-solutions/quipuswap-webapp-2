import { ReactElement } from 'react';

export interface ErrorBoundaryProps {
  fallback?: ReactElement;
  isError?: boolean;
}

export interface ErrorBoundaryInnerProps extends ErrorBoundaryProps {
  showErrorToast: (err: string | Error) => void;
}
