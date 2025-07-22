export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  CLIENT_ERROR = 'CLIENT_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
  QUIZ_ERROR = 'QUIZ_ERROR',
  STUDENT_ERROR = 'STUDENT_ERROR',
  GROUP_ERROR = 'GROUP_ERROR',
  QUESTION_ERROR = 'QUESTION_ERROR',
  COMPONENT_ERROR = 'COMPONENT_ERROR',
  ROUTE_ERROR = 'ROUTE_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  route?: string;
  component?: string;
  action?: string;
  timestamp: number;
  userAgent?: string;
  url?: string;
  additionalData?: Record<string, any>;
}

export interface AppError extends Error {
  type: ErrorType;
  severity: ErrorSeverity;
  code?: string;
  statusCode?: number;
  context?: ErrorContext;
  recoverable?: boolean;
  userMessage?: string;
  developerMessage?: string;
  originalError?: Error;
  retryCount?: number;
  maxRetries?: number;
  timestamp: number;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
}

export interface ErrorReport {
  id: string;
  error: AppError;
  errorInfo?: React.ErrorInfo;
  context: ErrorContext;
  resolved: boolean;
  reportedAt: number;
  resolvedAt?: number;
  resolution?: string;
}

export interface ErrorHandlerConfig {
  enableLogging?: boolean;
  enableReporting?: boolean;
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  showErrorDetails?: boolean;
  logLevel?: 'error' | 'warn' | 'info' | 'debug';
}

export interface ErrorRecoveryAction {
  label: string;
  action: () => void | Promise<void>;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface ErrorUIProps {
  error: AppError;
  errorInfo?: React.ErrorInfo;
  onRetry?: () => void;
  onReport?: () => void;
  onDismiss?: () => void;
  recoveryActions?: ErrorRecoveryAction[];
  showDetails?: boolean;
  className?: string;
}

export interface GlobalErrorState {
  errors: ErrorReport[];
  isLoading: boolean;
  lastError: AppError | null;
  errorCount: number;
  config: ErrorHandlerConfig;
}

export interface ErrorContextValue {
  state: GlobalErrorState;
  reportError: (error: AppError, errorInfo?: React.ErrorInfo) => void;
  clearError: (errorId: string) => void;
  clearAllErrors: () => void;
  retryAction: (errorId: string) => void;
  updateConfig: (config: Partial<ErrorHandlerConfig>) => void;
}

export type ErrorHandler = (error: AppError, errorInfo?: React.ErrorInfo) => void;

export type ErrorTransformer = (error: Error) => AppError;

export interface ErrorLogEntry {
  id: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  error?: AppError;
  context?: ErrorContext;
  timestamp: number;
  stack?: string;
}

export interface ErrorMetrics {
  totalErrors: number;
  errorsByType: Record<ErrorType, number>;
  errorsBySeverity: Record<ErrorSeverity, number>;
  averageResolutionTime: number;
  topErrors: Array<{
    error: AppError;
    count: number;
    lastOccurrence: number;
  }>;
}

// Utility type for error-prone operations
export type ErrorResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: AppError;
};

// Error creation helpers
export interface CreateErrorOptions {
  type: ErrorType;
  severity?: ErrorSeverity;
  code?: string;
  statusCode?: number;
  userMessage?: string;
  developerMessage?: string;
  context?: Partial<ErrorContext>;
  recoverable?: boolean;
  originalError?: Error;
  maxRetries?: number;
} 
