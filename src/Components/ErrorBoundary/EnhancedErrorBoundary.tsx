import React, { Component, ReactNode, ErrorInfo } from 'react';
import { toast } from 'react-toastify';
import { 
  AppError, 
  ErrorBoundaryState, 
  ErrorType, 
  ErrorSeverity, 
  ErrorRecoveryAction 
} from '../../types/errors';
import { errorLogger } from '../../services/errorLogger';
import ErrorUI from './ErrorUI';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: AppError, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
  enableRetry?: boolean;
  maxRetries?: number;
  context?: string;
  recoveryActions?: ErrorRecoveryAction[];
  className?: string;
}

class EnhancedErrorBoundary extends Component<Props, ErrorBoundaryState> {
  private retryTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const appError = errorLogger.transformError(error);
    const errorId = `boundary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error: appError,
      errorId,
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const appError = errorLogger.transformError(error);
    
    // Update error with additional context
    const enhancedError: AppError = {
      ...appError,
      context: {
        ...appError.context,
        component: this.props.context || 'Unknown Component',
        additionalData: {
          ...appError.context?.additionalData,
          componentStack: errorInfo.componentStack,
          errorBoundary: true
        }
      }
    };

    this.setState({
      error: enhancedError,
      errorInfo
    });

    // Log error
    errorLogger.error(
      `Error caught by ErrorBoundary in ${this.props.context || 'Unknown Component'}: ${error.message}`,
      enhancedError,
      enhancedError.context
    );

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(enhancedError, errorInfo);
    }

    // Show user-friendly error message
    if (enhancedError.severity === ErrorSeverity.CRITICAL) {
      toast.error('A critical error occurred. Please refresh the page.');
    } else if (enhancedError.severity === ErrorSeverity.HIGH) {
      toast.error('An error occurred. Please try again.');
    } else {
      toast.warn('Something went wrong. Please try again.');
    }

    // Report to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportToExternalService(enhancedError, errorInfo);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private reportToExternalService = (error: AppError, errorInfo: ErrorInfo) => {
    // In production, send to external monitoring service
    // Example: Sentry, LogRocket, etc.
    console.log('Would report to external service:', error, errorInfo);
  };

  private handleRetry = () => {
    const { error } = this.state;
    const { enableRetry = true, maxRetries = 3 } = this.props;
    
    if (!enableRetry || !error?.recoverable) {
      return;
    }

    const currentRetryCount = this.state.retryCount;
    
    if (currentRetryCount >= maxRetries) {
      toast.error('Maximum retry attempts reached. Please refresh the page.');
      return;
    }

    this.setState(prevState => ({
      retryCount: prevState.retryCount + 1
    }));

    // Add delay before retry
    const retryDelay = Math.min(1000 * Math.pow(2, currentRetryCount), 5000);
    
    this.retryTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null
      });
    }, retryDelay);

    toast.info(`Retrying... (${currentRetryCount + 1}/${maxRetries})`);
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleReport = () => {
    const { error, errorInfo } = this.state;
    if (error) {
      // In a real app, this would open a bug report form or send to support
      const reportData = {
        error: error.message,
        stack: error.stack,
        context: error.context,
        componentStack: errorInfo?.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };
      
      console.log('Error report data:', reportData);
      toast.success('Error report submitted. Thank you!');
    }
  };

  private handleDismiss = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0
    });
  };

  render() {
    const { hasError, error, errorInfo, retryCount } = this.state;
    const { 
      children, 
      fallback, 
      showErrorDetails = process.env.NODE_ENV === 'development',
      enableRetry = true,
      maxRetries = 3,
      recoveryActions = [],
      className = ''
    } = this.props;

    if (hasError && error) {
      // Custom fallback UI
      if (fallback) {
        return <div className={className}>{fallback}</div>;
      }

      // Default recovery actions
      const defaultRecoveryActions: ErrorRecoveryAction[] = [
        ...(enableRetry && error.recoverable && retryCount < maxRetries ? [{
          label: `Try Again ${retryCount > 0 ? `(${retryCount}/${maxRetries})` : ''}`,
          action: this.handleRetry,
          variant: 'primary' as const,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )
        }] : []),
        {
          label: 'Refresh Page',
          action: this.handleRefresh,
          variant: 'secondary' as const,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )
        },
        {
          label: 'Report Issue',
          action: this.handleReport,
          variant: 'secondary' as const,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )
        }
      ];

      // Use the ErrorUI component
      return (
        <div className={className}>
          <ErrorUI
            error={error}
            errorInfo={errorInfo}
            onRetry={enableRetry && error.recoverable ? this.handleRetry : undefined}
            onReport={this.handleReport}
            onDismiss={this.handleDismiss}
            recoveryActions={[...recoveryActions, ...defaultRecoveryActions]}
            showDetails={showErrorDetails}
          />
        </div>
      );
    }

    return children;
  }
}

export default EnhancedErrorBoundary; 
