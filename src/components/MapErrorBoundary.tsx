'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary for map components
 * Catches errors from dynamic imports and provides a graceful fallback
 */
export default class MapErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Map loading error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full bg-primary-50/50 dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 shadow-premium-lg mb-6">
          <div className="aspect-[16/9] w-full max-h-[500px] flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-700 p-8">
            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Map could not be loaded
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-4 max-w-sm">
              There was a problem loading the map. This might be due to a slow connection.
            </p>
            <button
              onClick={this.handleRetry}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          </div>
          {/* Legend placeholder for consistent layout */}
          <div className="flex justify-center gap-6 pb-4 text-sm text-primary-600 dark:text-primary-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span>Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span>Bucket List</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
