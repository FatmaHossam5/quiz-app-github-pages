import React from 'react';
import { ErrorUIProps, ErrorSeverity } from '../../types/errors';

const ErrorUI: React.FC<ErrorUIProps> = ({
  error,
  errorInfo,
  onRetry,
  onReport,
  onDismiss,
  recoveryActions = [],
  showDetails = false,
  className = ''
}) => {
  const getSeverityColor = (severity: ErrorSeverity) => {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        return 'bg-red-100 text-red-800 border-red-200';
      case ErrorSeverity.HIGH:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case ErrorSeverity.MEDIUM:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case ErrorSeverity.LOW:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: ErrorSeverity) => {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        return (
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case ErrorSeverity.HIGH:
        return (
          <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case ErrorSeverity.MEDIUM:
        return (
          <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getSeverityTitle = (severity: ErrorSeverity) => {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        return 'Critical Error';
      case ErrorSeverity.HIGH:
        return 'Error Occurred';
      case ErrorSeverity.MEDIUM:
        return 'Something Went Wrong';
      case ErrorSeverity.LOW:
        return 'Minor Issue';
      default:
        return 'Error';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 p-4 ${className}`}>
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-4 border-b ${getSeverityColor(error.severity)}`}>
          <div className="flex items-center space-x-3">
            {getSeverityIcon(error.severity)}
            <div>
              <h2 className="text-lg font-semibold">
                {getSeverityTitle(error.severity)}
              </h2>
              <p className="text-sm opacity-75">
                {formatTimestamp(error.timestamp)}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User-friendly message */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {error.userMessage || 'An unexpected error occurred'}
            </h3>
            <p className="text-gray-600">
              We apologize for the inconvenience. Please try one of the recovery options below.
            </p>
          </div>

          {/* Error context */}
          {error.context && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Error Context</h4>
              <div className="text-sm text-gray-600 space-y-1">
                {error.context.route && (
                  <div><strong>Route:</strong> {error.context.route}</div>
                )}
                {error.context.component && (
                  <div><strong>Component:</strong> {error.context.component}</div>
                )}
                {error.context.action && (
                  <div><strong>Action:</strong> {error.context.action}</div>
                )}
                {error.code && (
                  <div><strong>Error Code:</strong> {error.code}</div>
                )}
                {error.statusCode && (
                  <div><strong>Status Code:</strong> {error.statusCode}</div>
                )}
              </div>
            </div>
          )}

          {/* Recovery actions */}
          {recoveryActions.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Recovery Options</h4>
              <div className="flex flex-wrap gap-2">
                {recoveryActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`
                      inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${action.variant === 'primary' 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                        : action.variant === 'danger'
                        ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500'
                      }
                      focus:outline-none focus:ring-2 focus:ring-offset-2
                    `}
                  >
                    {action.icon && (
                      <span className="mr-2">{action.icon}</span>
                    )}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error details (development only) */}
          {showDetails && (
            <div className="mb-6">
              <details className="bg-red-50 border border-red-200 rounded-lg p-4">
                <summary className="text-sm font-medium text-red-800 cursor-pointer hover:text-red-900">
                  Technical Details (Development Only)
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-red-800 mb-2">Error Message</h5>
                    <pre className="text-xs text-red-700 bg-red-100 p-2 rounded overflow-auto">
                      {error.message}
                    </pre>
                  </div>
                  
                  {error.stack && (
                    <div>
                      <h5 className="text-sm font-medium text-red-800 mb-2">Stack Trace</h5>
                      <pre className="text-xs text-red-700 bg-red-100 p-2 rounded overflow-auto max-h-40">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                  
                  {errorInfo?.componentStack && (
                    <div>
                      <h5 className="text-sm font-medium text-red-800 mb-2">Component Stack</h5>
                      <pre className="text-xs text-red-700 bg-red-100 p-2 rounded overflow-auto max-h-40">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                  
                  {error.context && (
                    <div>
                      <h5 className="text-sm font-medium text-red-800 mb-2">Context</h5>
                      <pre className="text-xs text-red-700 bg-red-100 p-2 rounded overflow-auto max-h-40">
                        {JSON.stringify(error.context, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            </div>
          )}

          {/* Retry information */}
          {error.recoverable && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-800">
                  This error is recoverable. You can try again or use the recovery options above.
                </p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="flex space-x-2">
              {onRetry && error.recoverable && (
                <button
                  onClick={onRetry}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Try Again
                </button>
              )}
              
              {onReport && (
                <button
                  onClick={onReport}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Report Issue
                </button>
              )}
            </div>
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorUI; 
