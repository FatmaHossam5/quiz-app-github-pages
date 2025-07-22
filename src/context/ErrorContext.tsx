import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { ErrorType, ErrorSeverity, AppError, GlobalErrorState, ErrorHandlerConfig, ErrorContextValue, ErrorReport } from '../types/errors';
import { errorLogger } from '../services/errorLogger';
import { generateErrorId } from './ErrorContextUtils';

// Action types for error reducer
type ErrorAction = 
  | { type: 'REPORT_ERROR'; payload: { error: AppError; errorInfo?: React.ErrorInfo } }
  | { type: 'CLEAR_ERROR'; payload: { errorId: string } }
  | { type: 'CLEAR_ALL_ERRORS' }
  | { type: 'RETRY_ACTION'; payload: { errorId: string } }
  | { type: 'UPDATE_CONFIG'; payload: { config: Partial<ErrorHandlerConfig> } }
  | { type: 'SET_LOADING'; payload: { isLoading: boolean } };

// Initial state
const initialState: GlobalErrorState = {
  errors: [],
  isLoading: false,
  lastError: null,
  errorCount: 0,
  config: {
    enableLogging: true,
    enableReporting: true,
    enableRetry: true,
    maxRetries: 3,
    retryDelay: 1000,
    showErrorDetails: process.env.NODE_ENV === 'development',
    logLevel: 'error'
  }
};

// Error reducer
function errorReducer(state: GlobalErrorState, action: ErrorAction): GlobalErrorState {
  switch (action.type) {
    case 'REPORT_ERROR': {
      const { error, errorInfo } = action.payload;
      const errorId = generateErrorId();
      
      const report: ErrorReport = {
        id: errorId,
        error,
        errorInfo,
        context: {
          timestamp: Date.now(),
          route: window.location.pathname,
          userAgent: navigator.userAgent
        },
        resolved: false,
        reportedAt: Date.now()
      };

      // Log the error
      errorLogger.error(`Error reported: ${error.message}`, error, report.context);

      return {
        ...state,
        errors: [...state.errors, report],
        lastError: error,
        errorCount: state.errorCount + 1
      };
    }

    case 'CLEAR_ERROR': {
      const { errorId } = action.payload;
      const updatedErrors = state.errors.map(error => 
        error.id === errorId 
          ? { ...error, resolved: true, resolvedAt: Date.now() }
          : error
      );

      return {
        ...state,
        errors: updatedErrors,
        lastError: updatedErrors.find(e => !e.resolved)?.error || null
      };
    }

    case 'CLEAR_ALL_ERRORS': {
      const resolvedErrors = state.errors.map(error => ({
        ...error,
        resolved: true,
        resolvedAt: Date.now()
      }));

      return {
        ...state,
        errors: resolvedErrors,
        lastError: null
      };
    }

    case 'RETRY_ACTION': {
      const { errorId } = action.payload;
      const errorReport = state.errors.find(e => e.id === errorId);
      
      if (!errorReport || !errorReport.error.recoverable) {
        return state;
      }

      // Increment retry count
      const updatedError = {
        ...errorReport.error,
        retryCount: (errorReport.error.retryCount || 0) + 1
      };

      const updatedErrors = state.errors.map(error => 
        error.id === errorId 
          ? { ...error, error: updatedError }
          : error
      );

      return {
        ...state,
        errors: updatedErrors
      };
    }

    case 'UPDATE_CONFIG': {
      const { config } = action.payload;
      const updatedConfig = { ...state.config, ...config };
      
      // Update logger config as well
      errorLogger.updateConfig(updatedConfig);

      return {
        ...state,
        config: updatedConfig
      };
    }

    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.payload.isLoading
      };
    }

    default:
      return state;
  }
}

// Create context
const ErrorContext = createContext<ErrorContextValue | null>(null);

// Error provider component
interface ErrorProviderProps {
  children: ReactNode;
  initialConfig?: Partial<ErrorHandlerConfig>;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ 
  children, 
  initialConfig = {} 
}) => {
  const [state, dispatch] = useReducer(errorReducer, {
    ...initialState,
    config: { ...initialState.config, ...initialConfig }
  });

  // Set up global error handlers
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = errorLogger.createError(
        'Unhandled Promise Rejection',
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
            additionalData: { reason: event.reason }
          }
        }
      );

      reportError(error);
    };

    const handleError = (event: ErrorEvent) => {
      const error = errorLogger.createError(
        event.message || 'Global JavaScript Error',
        {
          type: ErrorType.UNEXPECTED_ERROR,
          severity: ErrorSeverity.HIGH,
          originalError: event.error || new Error(event.message),
          recoverable: false,
          context: {
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            route: window.location.pathname,
            additionalData: {
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno
            }
          }
        }
      );

      reportError(error);
    };

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  // Context value functions
  const reportError = (error: AppError, errorInfo?: React.ErrorInfo) => {
    dispatch({ type: 'REPORT_ERROR', payload: { error, errorInfo } });
  };

  const clearError = (errorId: string) => {
    dispatch({ type: 'CLEAR_ERROR', payload: { errorId } });
  };

  const clearAllErrors = () => {
    dispatch({ type: 'CLEAR_ALL_ERRORS' });
  };

  const retryAction = async (errorId: string) => {
    const errorReport = state.errors.find(e => e.id === errorId);
    
    if (!errorReport || !errorReport.error.recoverable) {
      return;
    }

    const { error } = errorReport;
    const currentRetryCount = error.retryCount || 0;
    
    if (currentRetryCount >= (error.maxRetries || 3)) {
      errorLogger.warn(`Maximum retry attempts reached for error: ${error.message}`);
      return;
    }

    dispatch({ type: 'RETRY_ACTION', payload: { errorId } });
    dispatch({ type: 'SET_LOADING', payload: { isLoading: true } });

    try {
      // Wait for retry delay
      await new Promise(resolve => setTimeout(resolve, state.config.retryDelay || 1000));
      
      // In a real application, you would re-execute the failed action here
      // For now, we'll just simulate success
      errorLogger.info(`Retrying action for error: ${error.message}`);
      
      dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
      
    } catch (retryError) {
      dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
      
      const newError = errorLogger.transformError(
        retryError instanceof Error ? retryError : new Error(String(retryError))
      );
      
      reportError(newError);
    }
  };

  const updateConfig = (config: Partial<ErrorHandlerConfig>) => {
    dispatch({ type: 'UPDATE_CONFIG', payload: { config } });
  };

  const contextValue: ErrorContextValue = {
    state,
    reportError,
    clearError,
    clearAllErrors,
    retryAction,
    updateConfig
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
};

export { ErrorContext };
export default ErrorContext; 
