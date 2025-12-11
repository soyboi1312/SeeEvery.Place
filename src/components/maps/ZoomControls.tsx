/**
 * ZoomControls Component
 * Explicit zoom buttons for map accessibility and UX
 */
'use client';

import { memo } from 'react';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset?: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
  showReset?: boolean;
}

const ZoomControls = memo(function ZoomControls({
  onZoomIn,
  onZoomOut,
  onReset,
  canZoomIn,
  canZoomOut,
  showReset = false,
}: ZoomControlsProps) {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-1 zoom-controls-hover hidden sm:flex z-10">
      <button
        onClick={onZoomIn}
        disabled={!canZoomIn}
        className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Zoom in"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
      <button
        onClick={onZoomOut}
        disabled={!canZoomOut}
        className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Zoom out"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      {showReset && onReset && (
        <button
          onClick={onReset}
          className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
          aria-label="Reset zoom"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      )}
    </div>
  );
});

export default ZoomControls;
