import { Component, ErrorInfo } from 'react';

export class ErrorBoundary extends Component {
  state: { error: Error | null } = { error: null };

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('O_O', error, errorInfo);
    this.setState({
      error
    });
  }

  render() {
    if (this.state.error != null) {
      return <div>{this.state.error?.message ?? 'Error'}</div>;
    }

    return this.props.children;
  }
}
