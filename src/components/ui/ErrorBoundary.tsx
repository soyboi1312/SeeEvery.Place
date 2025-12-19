'use client';

import { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Generic Error Boundary for UI components
 * Catches errors and provides a graceful fallback with retry option
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { fallbackTitle = 'Something went wrong', fallbackMessage = 'There was an error loading this content.' } = this.props;

      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
              {fallbackTitle}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-4 max-w-sm text-sm">
              {fallbackMessage}
            </p>
            <Button
              variant="outline"
              onClick={this.handleRetry}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
