import { toast } from 'react-toastify';
import { ErrorType, ErrorSeverity } from '../types/errors';
import { errorLogger } from './errorLogger';

class GlobalErrorHandler {
  private isInitialized = false;
  private errorReportingEnabled = true;
  private maxErrorsPerSession = 100;
  private sessionErrorCount = 0;
  private suppressedErrors = new Set<string>();
  private lastErrorTime = 0;
  private errorThrottleMs = 1000;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (this.isInitialized) return;

    // Handle unhandled promise rejections
    this.setupUnhandledRejectionHandler();
    
    // Handle global JavaScript errors
    this.setupGlobalErrorHandler();
    
    // Handle network errors
    this.setupNetworkErrorHandler();
    
    // Handle resource loading errors
    this.setupResourceErrorHandler();
    
    // Handle visibility change (user switching tabs)
    this.setupVisibilityHandler();
    
    // Handle page beforeunload
    this.setupBeforeUnloadHandler();
    
    this.isInitialized = true;
    
    errorLogger.info('Global error handler initialized');
  }

  private setupUnhandledRejectionHandler() {
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      const error = errorLogger.createError(
        `Unhandled Promise Rejection: ${event.reason?.message || event.reason}`,
        {
          type: ErrorType.UNEXPECTED_ERROR,
          severity: ErrorSeverity.HIGH,
          originalError: event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
          recoverable: false,
          context: {
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            route: window.location.pathname,
            additionalData: {
              type: 'unhandledRejection',
              reason: event.reason,
              stack: event.reason?.stack
            }
          }
        }
      );

      this.handleError(error);
      
      // Prevent default behavior (logging to console)
      event.preventDefault();
    });
  }

  private setupGlobalErrorHandler() {
    window.addEventListener('error', (event: ErrorEvent) => {
      const error = errorLogger.createError(
        event.message || 'Global JavaScript Error',
        {
          type: ErrorType.UNEXPECTED_ERROR,
          severity: this.getErrorSeverity(event.error),
          originalError: event.error || new Error(event.message),
          recoverable: false,
          context: {
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            route: window.location.pathname,
            additionalData: {
              type: 'globalError',
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno,
              stack: event.error?.stack
            }
          }
        }
      );

      this.handleError(error);
    });
  }

  private setupNetworkErrorHandler() {
    // Monitor fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        // Handle HTTP errors
        if (!response.ok) {
          const error = errorLogger.createError(
            `HTTP Error: ${response.status} ${response.statusText}`,
            {
              type: ErrorType.NETWORK_ERROR,
              severity: this.getHttpErrorSeverity(response.status),
              statusCode: response.status,
              recoverable: response.status >= 500, // Server errors are potentially recoverable
              context: {
                timestamp: Date.now(),
                url: response.url,
                route: window.location.pathname,
                additionalData: {
                  type: 'httpError',
                  method: args[1]?.method || 'GET',
                  status: response.status,
                  statusText: response.statusText,
                  headers: Object.fromEntries(response.headers.entries())
                }
              }
            }
          );

          this.handleError(error);
        }
        
        return response;
      } catch (networkError) {
        const error = errorLogger.createError(
          `Network Error: ${networkError.message}`,
          {
            type: ErrorType.NETWORK_ERROR,
            severity: ErrorSeverity.HIGH,
            originalError: networkError instanceof Error ? networkError : new Error(String(networkError)),
            recoverable: true,
            context: {
              timestamp: Date.now(),
              url: Array.isArray(args) ? args[0] : 'unknown',
              route: window.location.pathname,
              additionalData: {
                type: 'networkError',
                method: args[1]?.method || 'GET',
                stack: networkError?.stack
              }
            }
          }
        );

        this.handleError(error);
        throw networkError;
      }
    };
  }

  private setupResourceErrorHandler() {
    window.addEventListener('error', (event) => {
      const target = event.target as HTMLElement;
      
      // Handle resource loading errors (images, scripts, stylesheets)
      if (target && target !== window) {
        const tagName = target.tagName?.toLowerCase();
        const src = (target as any).src || (target as any).href;
        
        if (tagName && src) {
          const error = errorLogger.createError(
            `Resource loading failed: ${tagName} - ${src}`,
            {
              type: ErrorType.NETWORK_ERROR,
              severity: ErrorSeverity.MEDIUM,
              recoverable: true,
              context: {
                timestamp: Date.now(),
                url: src,
                route: window.location.pathname,
                additionalData: {
                  type: 'resourceError',
                  tagName,
                  src,
                  element: target.outerHTML?.substring(0, 200)
                }
              }
            }
          );

          this.handleError(error);
        }
      }
    }, true);
  }

  private setupVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // User returned to the page, check for any accumulated errors
        this.checkForCriticalErrors();
      }
    });
  }

  private setupBeforeUnloadHandler() {
    window.addEventListener('beforeunload', () => {
      // Flush any pending error reports
      this.flushPendingErrors();
    });
  }

  private handleError(error: any) {
    // Rate limiting
    const now = Date.now();
    if (now - this.lastErrorTime < this.errorThrottleMs) {
      return;
    }
    this.lastErrorTime = now;

    // Session error limit
    if (this.sessionErrorCount >= this.maxErrorsPerSession) {
      return;
    }
    this.sessionErrorCount++;

    // Check if error is suppressed
    const errorKey = `${error.type}:${error.message}`;
    if (this.suppressedErrors.has(errorKey)) {
      return;
    }

    // Log error
    errorLogger.error('Global error caught', error);

    // Show user notification based on severity
    this.showUserNotification(error);

    // Report to external service
    if (this.errorReportingEnabled) {
      this.reportToExternalService(error);
    }

    // Auto-recovery attempts
    this.attemptAutoRecovery(error);
  }

  private showUserNotification(error: any) {
    const { severity, userMessage } = error;
    
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        toast.error(userMessage || 'A critical error occurred. Please refresh the page.', {
          autoClose: false,
          toastId: 'critical-error'
        });
        break;
      case ErrorSeverity.HIGH:
        toast.error(userMessage || 'An error occurred. Please try again.', {
          autoClose: 5000,
          toastId: 'high-error'
        });
        break;
      case ErrorSeverity.MEDIUM:
        toast.warn(userMessage || 'Something went wrong. Please try again.', {
          autoClose: 3000,
          toastId: 'medium-error'
        });
        break;
      case ErrorSeverity.LOW:
        toast.info(userMessage || 'Minor issue detected.', {
          autoClose: 2000,
          toastId: 'low-error'
        });
        break;
    }
  }

  private attemptAutoRecovery(error: any) {
    if (!error.recoverable) return;

    switch (error.type) {
      case ErrorType.NETWORK_ERROR:
        // Auto-retry network requests after delay
        setTimeout(() => {
          if (navigator.onLine) {
            window.location.reload();
          }
        }, 5000);
        break;
        
      case ErrorType.AUTHENTICATION_ERROR:
        // Redirect to login
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        break;
    }
  }

  private reportToExternalService(error: any) {
    // In production, send to external monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, DataDog, etc.
      console.log('Would report to external service:', error);
    }
  }

  private getErrorSeverity(error: Error): ErrorSeverity {
    if (!error) return ErrorSeverity.LOW;
    
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('out of memory') || message.includes('maximum call stack')) {
      return ErrorSeverity.CRITICAL;
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return ErrorSeverity.HIGH;
    }
    
    if (message.includes('permission') || message.includes('unauthorized')) {
      return ErrorSeverity.HIGH;
    }
    
    return ErrorSeverity.MEDIUM;
  }

  private getHttpErrorSeverity(status: number): ErrorSeverity {
    if (status >= 500) return ErrorSeverity.CRITICAL;
    if (status === 401 || status === 403) return ErrorSeverity.HIGH;
    if (status === 404) return ErrorSeverity.MEDIUM;
    return ErrorSeverity.LOW;
  }

  private checkForCriticalErrors() {
    const criticalErrors = errorLogger.getLogsByLevel('error')
      .filter(log => log.error?.severity === ErrorSeverity.CRITICAL)
      .slice(-5); // Get last 5 critical errors
    
    if (criticalErrors.length > 0) {
      toast.error('Critical errors detected. Consider refreshing the page.', {
        autoClose: false,
        toastId: 'critical-errors-detected'
      });
    }
  }

  private flushPendingErrors() {
    // In a real implementation, this would send any queued errors to the server
    const pendingErrors = errorLogger.getLogs().filter(log => log.level === 'error');
    if (pendingErrors.length > 0) {
      console.log('Flushing pending errors:', pendingErrors);
    }
  }

  // Public methods
  public suppressError(type: ErrorType, message: string) {
    const errorKey = `${type}:${message}`;
    this.suppressedErrors.add(errorKey);
  }

  public unsuppressError(type: ErrorType, message: string) {
    const errorKey = `${type}:${message}`;
    this.suppressedErrors.delete(errorKey);
  }

  public setErrorReporting(enabled: boolean) {
    this.errorReportingEnabled = enabled;
  }

  public getSessionErrorCount() {
    return this.sessionErrorCount;
  }

  public resetSessionErrorCount() {
    this.sessionErrorCount = 0;
  }

  public destroy() {
    if (!this.isInitialized) return;
    
    // Remove all event listeners
    window.removeEventListener('unhandledrejection', this.handleError);
    window.removeEventListener('error', this.handleError);
    
    this.isInitialized = false;
    
    errorLogger.info('Global error handler destroyed');
  }
}

// Global instance
export const globalErrorHandler = new GlobalErrorHandler();

// Utility functions
export const suppressGlobalError = (type: ErrorType, message: string) => {
  globalErrorHandler.suppressError(type, message);
};

export const unsuppressGlobalError = (type: ErrorType, message: string) => {
  globalErrorHandler.unsuppressError(type, message);
};

export const setGlobalErrorReporting = (enabled: boolean) => {
  globalErrorHandler.setErrorReporting(enabled);
};

export const getGlobalErrorCount = () => {
  return globalErrorHandler.getSessionErrorCount();
};

export const resetGlobalErrorCount = () => {
  globalErrorHandler.resetSessionErrorCount();
};

export default globalErrorHandler; 
