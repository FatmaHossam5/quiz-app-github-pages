import { 
  AppError, 
  ErrorLogEntry, 
  ErrorContext, 
  ErrorSeverity, 
  ErrorType, 
  ErrorMetrics,
  ErrorHandlerConfig,
  CreateErrorOptions
} from '../types/errors';

class ErrorLogger {
  private logs: ErrorLogEntry[] = [];
  private maxLogSize = 1000;
  private config: ErrorHandlerConfig;

  constructor(config: ErrorHandlerConfig = {}) {
    this.config = {
      enableLogging: true,
      enableReporting: true,
      logLevel: 'error',
      showErrorDetails: process.env.NODE_ENV === 'development',
      maxRetries: 3,
      retryDelay: 1000,
      enableRetry: true,
      ...config
    };
  }

  // Create standardized AppError from various inputs
  createError(message: string, options: CreateErrorOptions): AppError {
    const timestamp = Date.now();
    const context: ErrorContext = {
      timestamp,
      url: window.location.href,
      userAgent: navigator.userAgent,
      route: window.location.pathname,
      ...options.context
    };

    const error: AppError = {
      name: 'AppError',
      message,
      type: options.type,
      severity: options.severity || ErrorSeverity.MEDIUM,
      code: options.code,
      statusCode: options.statusCode,
      context,
      recoverable: options.recoverable ?? true,
      userMessage: options.userMessage || this.getDefaultUserMessage(options.type),
      developerMessage: options.developerMessage || message,
      originalError: options.originalError,
      retryCount: 0,
      maxRetries: options.maxRetries || this.config.maxRetries || 3,
      timestamp,
      stack: options.originalError?.stack || new Error().stack
    };

    return error;
  }

  // Transform regular Error to AppError
  transformError(error: Error): AppError {
    let type = ErrorType.UNEXPECTED_ERROR;
    let severity = ErrorSeverity.MEDIUM;
    let statusCode: number | undefined;

    // Determine error type based on error message or properties
    if (error.message.includes('Network Error') || error.message.includes('fetch')) {
      type = ErrorType.NETWORK_ERROR;
      severity = ErrorSeverity.HIGH;
    } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      type = ErrorType.AUTHENTICATION_ERROR;
      severity = ErrorSeverity.HIGH;
      statusCode = 401;
    } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
      type = ErrorType.AUTHORIZATION_ERROR;
      severity = ErrorSeverity.HIGH;
      statusCode = 403;
    } else if (error.message.includes('404') || error.message.includes('Not Found')) {
      type = ErrorType.NOT_FOUND_ERROR;
      severity = ErrorSeverity.MEDIUM;
      statusCode = 404;
    } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
      type = ErrorType.SERVER_ERROR;
      severity = ErrorSeverity.CRITICAL;
      statusCode = 500;
    } else if (error.message.includes('timeout') || error.message.includes('Timeout')) {
      type = ErrorType.TIMEOUT_ERROR;
      severity = ErrorSeverity.HIGH;
    }

    return this.createError(error.message, {
      type,
      severity,
      statusCode,
      originalError: error,
      developerMessage: error.message,
      context: {
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        route: window.location.pathname
      }
    });
  }

  // Main logging method
  log(level: 'error' | 'warn' | 'info' | 'debug', message: string, error?: AppError, context?: ErrorContext): void {
    if (!this.config.enableLogging) return;
    if (!this.shouldLog(level)) return;

    const logEntry: ErrorLogEntry = {
      id: this.generateId(),
      level,
      message,
      error,
      context,
      timestamp: Date.now(),
      stack: error?.stack || new Error().stack
    };

    this.addLogEntry(logEntry);
    this.outputToConsole(logEntry);
    
    if (this.config.enableReporting && level === 'error') {
      this.reportToExternalService(logEntry);
    }
  }

  // Specific log level methods
  error(message: string, error?: AppError, context?: ErrorContext): void {
    this.log('error', message, error, context);
  }

  warn(message: string, error?: AppError, context?: ErrorContext): void {
    this.log('warn', message, error, context);
  }

  info(message: string, error?: AppError, context?: ErrorContext): void {
    this.log('info', message, error, context);
  }

  debug(message: string, error?: AppError, context?: ErrorContext): void {
    this.log('debug', message, error, context);
  }

  // Get error metrics
  getMetrics(): ErrorMetrics {
    const errorLogs = this.logs.filter(log => log.level === 'error' && log.error);
    const errors = errorLogs.map(log => log.error!);

    const errorsByType: Record<ErrorType, number> = {} as Record<ErrorType, number>;
    const errorsBySeverity: Record<ErrorSeverity, number> = {} as Record<ErrorSeverity, number>;

    // Initialize counters
    Object.values(ErrorType).forEach(type => {
      errorsByType[type] = 0;
    });
    Object.values(ErrorSeverity).forEach(severity => {
      errorsBySeverity[severity] = 0;
    });

    // Count errors by type and severity
    errors.forEach(error => {
      errorsByType[error.type]++;
      errorsBySeverity[error.severity]++;
    });

    // Calculate top errors
    const errorCounts = new Map<string, { error: AppError; count: number; lastOccurrence: number }>();
    
    errors.forEach(error => {
      const key = `${error.type}:${error.message}`;
      if (errorCounts.has(key)) {
        const existing = errorCounts.get(key)!;
        existing.count++;
        existing.lastOccurrence = Math.max(existing.lastOccurrence, error.timestamp);
      } else {
        errorCounts.set(key, {
          error,
          count: 1,
          lastOccurrence: error.timestamp
        });
      }
    });

    const topErrors = Array.from(errorCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalErrors: errors.length,
      errorsByType,
      errorsBySeverity,
      averageResolutionTime: this.calculateAverageResolutionTime(),
      topErrors
    };
  }

  // Clear logs
  clearLogs(): void {
    this.logs = [];
  }

  // Get all logs
  getLogs(): ErrorLogEntry[] {
    return [...this.logs];
  }

  // Get logs by level
  getLogsByLevel(level: 'error' | 'warn' | 'info' | 'debug'): ErrorLogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  // Update configuration
  updateConfig(config: Partial<ErrorHandlerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Private methods
  private shouldLog(level: 'error' | 'warn' | 'info' | 'debug'): boolean {
    const levels = ['error', 'warn', 'info', 'debug'];
    const configLevel = this.config.logLevel || 'error';
    return levels.indexOf(level) <= levels.indexOf(configLevel);
  }

  private addLogEntry(entry: ErrorLogEntry): void {
    this.logs.push(entry);
    
    // Maintain max log size
    if (this.logs.length > this.maxLogSize) {
      this.logs = this.logs.slice(-this.maxLogSize);
    }
  }

  private outputToConsole(entry: ErrorLogEntry): void {
    const { level, message, error, context, timestamp } = entry;
    const time = new Date(timestamp).toISOString();
    
    const logMessage = `[${time}] ${level.toUpperCase()}: ${message}`;
    
    switch (level) {
      case 'error':
        console.error(logMessage, error, context);
        break;
      case 'warn':
        console.warn(logMessage, error, context);
        break;
      case 'info':
        console.info(logMessage, error, context);
        break;
      case 'debug':
        console.debug(logMessage, error, context);
        break;
    }
  }

  private reportToExternalService(entry: ErrorLogEntry): void {
    // In a real application, you would send this to an external service
    // like Sentry, LogRocket, DataDog, etc.
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to external logging service
      // this.sendToSentry(entry);
      // this.sendToLogRocket(entry);
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDefaultUserMessage(type: ErrorType): string {
    switch (type) {
      case ErrorType.NETWORK_ERROR:
        return 'Network connection issue. Please check your internet connection and try again.';
      case ErrorType.AUTHENTICATION_ERROR:
        return 'Authentication required. Please log in and try again.';
      case ErrorType.AUTHORIZATION_ERROR:
        return 'You do not have permission to perform this action.';
      case ErrorType.VALIDATION_ERROR:
        return 'Please check your input and try again.';
      case ErrorType.NOT_FOUND_ERROR:
        return 'The requested resource was not found.';
      case ErrorType.SERVER_ERROR:
        return 'Server error occurred. Please try again later.';
      case ErrorType.TIMEOUT_ERROR:
        return 'Request timed out. Please try again.';
      case ErrorType.QUIZ_ERROR:
        return 'Quiz operation failed. Please try again.';
      case ErrorType.STUDENT_ERROR:
        return 'Student operation failed. Please try again.';
      case ErrorType.GROUP_ERROR:
        return 'Group operation failed. Please try again.';
      case ErrorType.QUESTION_ERROR:
        return 'Question operation failed. Please try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  private calculateAverageResolutionTime(): number {
    // This would be implemented based on your error tracking needs
    // For now, return a placeholder
    return 0;
  }
}

// Global error logger instance
export const errorLogger = new ErrorLogger();

// Utility functions
export const createNetworkError = (message: string, statusCode?: number): AppError => {
  return errorLogger.createError(message, {
    type: ErrorType.NETWORK_ERROR,
    severity: ErrorSeverity.HIGH,
    statusCode,
    recoverable: true
  });
};

export const createAuthError = (message: string): AppError => {
  return errorLogger.createError(message, {
    type: ErrorType.AUTHENTICATION_ERROR,
    severity: ErrorSeverity.HIGH,
    recoverable: false
  });
};

export const createValidationError = (message: string, field?: string): AppError => {
  return errorLogger.createError(message, {
    type: ErrorType.VALIDATION_ERROR,
    severity: ErrorSeverity.MEDIUM,
    recoverable: true,
    context: {
      timestamp: Date.now(),
      additionalData: { field }
    }
  });
};

export const createQuizError = (message: string, quizId?: string): AppError => {
  return errorLogger.createError(message, {
    type: ErrorType.QUIZ_ERROR,
    severity: ErrorSeverity.MEDIUM,
    recoverable: true,
    context: {
      timestamp: Date.now(),
      additionalData: { quizId }
    }
  });
};

export default errorLogger; 
