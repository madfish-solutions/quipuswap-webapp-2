import { ReactElement } from 'react';

import * as Sentry from '@sentry/react';

import { CFC } from '../../../types';
import { useToasts } from '../../../utils';

export interface Props {
  fallback: ReactElement;
}

export const ErrorBoundary: CFC<Props> = ({ fallback, children }) => {
  const { showErrorToast } = useToasts();

  return (
    <Sentry.ErrorBoundary fallback={fallback} onError={showErrorToast}>
      {children}
    </Sentry.ErrorBoundary>
  );
};
