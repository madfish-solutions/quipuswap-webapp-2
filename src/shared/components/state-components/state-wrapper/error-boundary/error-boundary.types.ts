import { ReactElement, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  isError?: boolean;
  fallback: ReactElement;
}

export interface ErrorBoundaryInnerProps extends ErrorBoundaryProps {
  showErrorToast: (err: string | Error) => void;
  children?: ReactNode;
}
