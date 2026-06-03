import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#fee2e2', color: '#991b1b', minHeight: '100vh' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Something went wrong.</h1>
          <p style={{ fontWeight: 'bold' }}>{this.state.error && this.state.error.toString()}</p>
          <pre style={{ marginTop: '20px', whiteSpace: 'pre-wrap', fontSize: '12px', backgroundColor: '#fecaca', padding: '10px', borderRadius: '5px' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
