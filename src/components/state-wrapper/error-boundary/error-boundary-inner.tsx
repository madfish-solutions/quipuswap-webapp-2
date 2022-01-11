import { Component, ErrorInfo, PropsWithChildren } from 'react';

import { ErrorBoundaryInnerProps } from './error-boundary.types';

export class ErrorBoundaryInner extends Component<ErrorBoundaryInnerProps> {
  state: { error: Error | null } = { error: null };

  constructor(props: PropsWithChildren<ErrorBoundaryInnerProps>) {
    super(props);

    this.showErrorToast = props.showErrorToast;
  }

  // eslint-disable-next-line
  showErrorToast(err: string | Error) { }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('O_O', error, errorInfo);
    this.setState({
      error
    });
    this.showErrorToast(error);
  }

  render() {
    if (this.state.error != null || this.props.isError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
