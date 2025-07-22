import { useContext } from 'react';
import { ErrorContext } from './ErrorContext';
import { ErrorContextValue, ErrorType, ErrorSeverity } from '../types/errors';
import { errorLogger } from '../services/errorLogger';

// Custom hook to use error context
export const useErrorContext = (): ErrorContextValue => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorContext must be used within an ErrorProvider');
  }
  return context;
};

// Custom hook for error reporting
export const useErrorReporting = () => {
  const { reportError } = useErrorContext();

  const reportNetworkError = (message: string, statusCode?: number) => {
    const error = errorLogger.createError(message, {
      type: ErrorType.NETWORK_ERROR,
      severity: ErrorSeverity.HIGH,
      statusCode,
      recoverable: true
    });
    reportError(error);
  };

  const reportAuthError = (message: string) => {
    const error = errorLogger.createError(message, {
      type: ErrorType.AUTHENTICATION_ERROR,
      severity: ErrorSeverity.HIGH,
      recoverable: false
    });
    reportError(error);
  };

  const reportValidationError = (message: string, field?: string) => {
    const error = errorLogger.createError(message, {
      type: ErrorType.VALIDATION_ERROR,
      severity: ErrorSeverity.MEDIUM,
      recoverable: true,
      context: {
        timestamp: Date.now(),
        additionalData: { field }
      }
    });
    reportError(error);
  };

  const reportQuizError = (message: string, quizId?: string) => {
    const error = errorLogger.createError(message, {
      type: ErrorType.QUIZ_ERROR,
      severity: ErrorSeverity.MEDIUM,
      recoverable: true,
      context: {
        timestamp: Date.now(),
        additionalData: { quizId }
      }
    });
    reportError(error);
  };

  const reportUnexpectedError = (originalError: Error) => {
    const error = errorLogger.transformError(originalError);
    reportError(error);
  };

  return {
    reportError,
    reportNetworkError,
    reportAuthError,
    reportValidationError,
    reportQuizError,
    reportUnexpectedError
  };
};

// Utility function to generate error IDs
export function generateErrorId(): string {
  return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
} 