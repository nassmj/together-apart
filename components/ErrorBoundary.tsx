import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-4">
          <motion.div
            className="max-w-md w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card text-center">
              <div className="card-body">
                <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExclamationTriangleIcon className="w-8 h-8 text-error" />
                </div>
                
                <h2 className="text-xl font-semibold text-primary mb-2">
                  Oops! Something went wrong
                </h2>
                
                <p className="text-secondary mb-6">
                  We encountered an unexpected error. Don't worry, your data is safe.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={this.handleRetry}
                    className="btn btn-primary w-full"
                    aria-label="Try again"
                  >
                    <ArrowPathIcon className="w-4 h-4 mr-2" />
                    Try Again
                  </button>
                  
                  <button
                    onClick={() => window.location.reload()}
                    className="btn btn-ghost w-full"
                    aria-label="Refresh page"
                  >
                    Refresh Page
                  </button>
                </div>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-6 text-left">
                    <summary className="cursor-pointer text-sm text-muted hover:text-primary">
                      Error Details (Development)
                    </summary>
                    <div className="mt-2 p-3 bg-surface-alt rounded-lg text-xs font-mono text-error overflow-auto">
                      <div className="mb-2">
                        <strong>Error:</strong> {this.state.error.message}
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <strong>Stack:</strong>
                          <pre className="mt-1 whitespace-pre-wrap">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

