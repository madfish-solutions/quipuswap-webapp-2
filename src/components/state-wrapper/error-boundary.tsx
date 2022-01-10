import { Component, ErrorInfo } from 'react';

export class ErrorBoundary extends Component {
  state: { hasError: boolean; error: Error | null } = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('O_O', error, errorInfo);
    this.setState({
      error
    });
  }

  render() {
    if (this.state.hasError) {
      return <div>error={this.state.error ?? 'Something went wrong :('}</div>;
    }

    return this.props.children;
  }
}
