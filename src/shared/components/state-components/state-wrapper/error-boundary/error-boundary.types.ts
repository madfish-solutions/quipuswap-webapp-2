import { ReactElement, ReactNode } from 'react';

import { useToasts } from '@shared/utils';

export interface ErrorBoundaryProps {
  isError?: boolean;
  fallback: ReactElement;
}

export interface ErrorBoundaryInnerProps extends ErrorBoundaryProps {
  showErrorToast: ReturnType<typeof useToasts>['showErrorToast'];
  children?: ReactNode;
}
