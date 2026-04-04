import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
          <div className="text-center p-8 max-w-md">
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-white mb-2">
              Oops! Something went wrong
            </h1>
            
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}