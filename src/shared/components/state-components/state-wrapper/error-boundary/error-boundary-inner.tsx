import { ErrorInfo, PropsWithChildren, ReactElement } from 'react';

import { ErrorBoundary, ErrorBoundaryProps } from '@sentry/react';

import { Console } from '@shared/services';

import { ErrorBoundaryInnerProps } from './error-boundary.types';

export class ErrorBoundaryInner extends ErrorBoundary {
  isError = false;
  constructor(props: PropsWithChildren<ErrorBoundaryInnerProps> & ErrorBoundaryProps) {
    super(props);

    this.isError = Boolean(props.isError);
    this.showErrorToast = props.showErrorToast;
  }

  // eslint-disable-next-line
  showErrorToast(err: string | Error) { }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    super.componentDidCatch(error, errorInfo);

    Console.error({ error, errorInfo });

    this.showErrorToast(error);
  }

  render() {
    if (this.isError) {
      return (this.props.fallback ?? null) as ReactElement;
    }

    return super.render();
  }
}
