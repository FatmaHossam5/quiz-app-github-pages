import { useCallback, useEffect, useRef, useState } from 'react';
import { useErrorReporting } from '../context/ErrorContext';
import { AppError, ErrorResult, ErrorType, ErrorSeverity } from '../types/errors';
import { errorLogger } from '../services/errorLogger';

// Hook for handling async operations with error management
export const useAsyncError = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const { reportUnexpectedError } = useErrorReporting();

  const execute = useCallback(async <T>(
    asyncFunction: () => Promise<T>,
    errorType: ErrorType = ErrorType.UNEXPECTED_ERROR,
    options?: {
      onError?: (error: AppError) => void;
      onSuccess?: (result: T) => void;
      retryCount?: number;
      timeout?: number;
    }
  ): Promise<ErrorResult<T>> => {
    setLoading(true);
    setError(null);

    try {
      let result: T;
      
      if (options?.timeout) {
        // Add timeout functionality
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Operation timed out')), options.timeout);
        });
        
        result = await Promise.race([asyncFunction(), timeoutPromise]);
      } else {
        result = await asyncFunction();
      }

      setLoading(false);
      options?.onSuccess?.(result);
      
      return {
        success: true,
        data: result
      };
    } catch (originalError) {
      setLoading(false);
      
      const appError = originalError instanceof Error 
        ? errorLogger.transformError(originalError)
        : errorLogger.createError(String(originalError), {
            type: errorType,
            severity: ErrorSeverity.HIGH,
            recoverable: true
          });
      
      setError(appError);
      reportUnexpectedError(originalError instanceof Error ? originalError : new Error(String(originalError)));
      options?.onError?.(appError);
      
      return {
        success: false,
        error: appError
      };
    }
  }, [reportUnexpectedError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    clearError
  };
};

// Hook for retry functionality
export const useRetry = () => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const { reportUnexpectedError } = useErrorReporting();

  const retry = useCallback(async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    retryDelay: number = 1000,
    backoff: boolean = true
  ): Promise<ErrorResult<T>> => {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      setRetryCount(attempt);
      setIsRetrying(attempt > 0);
      
      try {
        if (attempt > 0) {
          // Calculate delay with exponential backoff if enabled
          const delay = backoff ? retryDelay * Math.pow(2, attempt - 1) : retryDelay;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        const result = await operation();
        setIsRetrying(false);
        setRetryCount(0);
        
        return {
          success: true,
          data: result
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === maxRetries) {
          setIsRetrying(false);
          const appError = errorLogger.transformError(lastError);
          reportUnexpectedError(lastError);
          
          return {
            success: false,
            error: appError
          };
        }
      }
    }
    
    // This should never be reached, but TypeScript requires it
    const appError = errorLogger.transformError(lastError || new Error('Unknown error'));
    return {
      success: false,
      error: appError
    };
  }, [reportUnexpectedError]);

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return {
    retry,
    retryCount,
    isRetrying,
    reset
  };
};

// Hook for error recovery actions
export const useErrorRecovery = () => {
  const [isRecovering, setIsRecovering] = useState(false);
  const { reportUnexpectedError } = useErrorReporting();

  const recover = useCallback(async (
    recoveryAction: () => Promise<void> | void,
    fallbackAction?: () => Promise<void> | void
  ): Promise<boolean> => {
    setIsRecovering(true);
    
    try {
      await recoveryAction();
      setIsRecovering(false);
      return true;
    } catch (error) {
      try {
        if (fallbackAction) {
          await fallbackAction();
          setIsRecovering(false);
          return true;
        }
      } catch (fallbackError) {
        reportUnexpectedError(fallbackError instanceof Error ? fallbackError : new Error(String(fallbackError)));
      }
      
      reportUnexpectedError(error instanceof Error ? error : new Error(String(error)));
      setIsRecovering(false);
      return false;
    }
  }, [reportUnexpectedError]);

  return {
    recover,
    isRecovering
  };
};

// Hook for handling form errors
export const useFormErrorHandler = () => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { reportValidationError } = useErrorReporting();

  const setFieldError = useCallback((field: string, message: string) => {
    setFieldErrors(prev => ({
      ...prev,
      [field]: message
    }));
    reportValidationError(message, field);
  }, [reportValidationError]);

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllFieldErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  const hasFieldError = useCallback((field: string): boolean => {
    return field in fieldErrors;
  }, [fieldErrors]);

  const getFieldError = useCallback((field: string): string | undefined => {
    return fieldErrors[field];
  }, [fieldErrors]);

  return {
    fieldErrors,
    setFieldError,
    clearFieldError,
    clearAllFieldErrors,
    hasFieldError,
    getFieldError
  };
};

// Hook for handling network errors
export const useNetworkErrorHandler = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { reportNetworkError } = useErrorReporting();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleNetworkError = useCallback((error: Error | string, statusCode?: number) => {
    const message = error instanceof Error ? error.message : error;
    reportNetworkError(message, statusCode);
  }, [reportNetworkError]);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  return {
    isOnline,
    handleNetworkError,
    checkConnection
  };
};

// Hook for component-level error boundaries
export const useComponentErrorBoundary = () => {
  const [error, setError] = useState<AppError | null>(null);
  const { reportError } = useErrorReporting();

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const catchError = useCallback((error: Error | AppError, errorInfo?: React.ErrorInfo) => {
    const appError = error instanceof Error 
      ? errorLogger.transformError(error)
      : error;
    
    setError(appError);
    reportError(appError, errorInfo);
  }, [reportError]);

  return {
    error,
    catchError,
    resetError
  };
};

// Hook for error rate limiting
export const useErrorRateLimit = (maxErrors: number = 5, timeWindow: number = 60000) => {
  const errorTimes = useRef<number[]>([]);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    const windowStart = now - timeWindow;
    
    // Remove old errors outside the time window
    errorTimes.current = errorTimes.current.filter(time => time > windowStart);
    
    if (errorTimes.current.length >= maxErrors) {
      setIsRateLimited(true);
      return false;
    }
    
    errorTimes.current.push(now);
    setIsRateLimited(false);
    return true;
  }, [maxErrors, timeWindow]);

  const resetRateLimit = useCallback(() => {
    errorTimes.current = [];
    setIsRateLimited(false);
  }, []);

  return {
    checkRateLimit,
    isRateLimited,
    resetRateLimit
  };
};

// Hook for error analytics
export const useErrorAnalytics = () => {
  const [errorMetrics, setErrorMetrics] = useState({
    totalErrors: 0,
    errorRate: 0,
    mostCommonError: null as string | null,
    avgResolutionTime: 0
  });

  const updateMetrics = useCallback(() => {
    const metrics = errorLogger.getMetrics();
    setErrorMetrics({
      totalErrors: metrics.totalErrors,
      errorRate: metrics.totalErrors / (Date.now() / 1000 / 60), // errors per minute
      mostCommonError: metrics.topErrors[0]?.error.message || null,
      avgResolutionTime: metrics.averageResolutionTime
    });
  }, []);

  useEffect(() => {
    updateMetrics();
    const interval = setInterval(updateMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [updateMetrics]);

  return {
    errorMetrics,
    updateMetrics
  };
};

// Hook for handling timeout errors
export const useTimeoutHandler = () => {
  const { reportError } = useErrorReporting();

  const withTimeout = useCallback(async <T>(
    promise: Promise<T>,
    timeoutMs: number,
    timeoutMessage: string = 'Operation timed out'
  ): Promise<T> => {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        const timeoutError = errorLogger.createError(timeoutMessage, {
          type: ErrorType.TIMEOUT_ERROR,
          severity: ErrorSeverity.HIGH,
          recoverable: true
        });
        reportError(timeoutError);
        reject(timeoutError);
      }, timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
  }, [reportError]);

  return {
    withTimeout
  };
};

export default {
  useAsyncError,
  useRetry,
  useErrorRecovery,
  useFormErrorHandler,
  useNetworkErrorHandler,
  useComponentErrorBoundary,
  useErrorRateLimit,
  useErrorAnalytics,
  useTimeoutHandler
}; 
