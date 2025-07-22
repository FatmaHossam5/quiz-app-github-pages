import React, { ReactNode } from 'react';
import EnhancedErrorBoundary from './EnhancedErrorBoundary';
import { ErrorRecoveryAction } from '../../types/errors';

// Route-specific error boundary
interface RouteErrorBoundaryProps {
  children: ReactNode;
  routeName: string;
  enableRetry?: boolean;
  fallbackComponent?: ReactNode;
}

export const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = ({
  children,
  routeName,
  enableRetry = true,
  fallbackComponent
}) => {
  const recoveryActions: ErrorRecoveryAction[] = [
    {
      label: 'Go Home',
      action: () => { window.location.href = '/'; },
      variant: 'primary',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      label: 'Go Back',
      action: () => window.history.back(),
      variant: 'secondary',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      )
    }
  ];

  return (
    <EnhancedErrorBoundary
      context={`Route: ${routeName}`}
      enableRetry={enableRetry}
      recoveryActions={recoveryActions}
      fallback={fallbackComponent}
    >
      {children}
    </EnhancedErrorBoundary>
  );
};

// API call error boundary
interface ApiErrorBoundaryProps {
  children: ReactNode;
  apiEndpoint: string;
  enableRetry?: boolean;
  maxRetries?: number;
  onRetry?: () => void;
}

export const ApiErrorBoundary: React.FC<ApiErrorBoundaryProps> = ({
  children,
  apiEndpoint,
  enableRetry = true,
  maxRetries = 3,
  onRetry
}) => {
  const recoveryActions: ErrorRecoveryAction[] = [
    ...(onRetry ? [{
      label: 'Retry API Call',
      action: onRetry,
      variant: 'primary' as const,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    }] : []),
    {
      label: 'Check Network',
      action: () => {
        if (navigator.onLine) {
          alert('Your connection appears to be working. The server might be experiencing issues.');
        } else {
          alert('You appear to be offline. Please check your internet connection.');
        }
      },
      variant: 'secondary' as const,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      )
    }
  ];

  return (
    <EnhancedErrorBoundary
      context={`API: ${apiEndpoint}`}
      enableRetry={enableRetry}
      maxRetries={maxRetries}
      recoveryActions={recoveryActions}
    >
      {children}
    </EnhancedErrorBoundary>
  );
};

// Form error boundary
interface FormErrorBoundaryProps {
  children: ReactNode;
  formName: string;
  onClearForm?: () => void;
  onSaveDraft?: () => void;
}

export const FormErrorBoundary: React.FC<FormErrorBoundaryProps> = ({
  children,
  formName,
  onClearForm,
  onSaveDraft
}) => {
  const recoveryActions: ErrorRecoveryAction[] = [
    ...(onSaveDraft ? [{
      label: 'Save Draft',
      action: onSaveDraft,
      variant: 'primary' as const,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
      )
    }] : []),
    ...(onClearForm ? [{
      label: 'Clear Form',
      action: onClearForm,
      variant: 'danger' as const,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )
    }] : [])
  ];

  return (
    <EnhancedErrorBoundary
      context={`Form: ${formName}`}
      enableRetry={true}
      recoveryActions={recoveryActions}
    >
      {children}
    </EnhancedErrorBoundary>
  );
};

// Quiz-specific error boundary
interface QuizErrorBoundaryProps {
  children: ReactNode;
  quizId?: string;
  onSaveProgress?: () => void;
  onExitQuiz?: () => void;
}

export const QuizErrorBoundary: React.FC<QuizErrorBoundaryProps> = ({
  children,
  quizId,
  onSaveProgress,
  onExitQuiz
}) => {
  const recoveryActions: ErrorRecoveryAction[] = [
    ...(onSaveProgress ? [{
      label: 'Save Progress',
      action: onSaveProgress,
      variant: 'primary' as const,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
      )
    }] : []),
    ...(onExitQuiz ? [{
      label: 'Exit Quiz',
      action: onExitQuiz,
      variant: 'secondary' as const,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      )
    }] : [])
  ];

  return (
    <EnhancedErrorBoundary
      context={`Quiz: ${quizId || 'Unknown'}`}
      enableRetry={true}
      recoveryActions={recoveryActions}
    >
      {children}
    </EnhancedErrorBoundary>
  );
};

// Modal error boundary
interface ModalErrorBoundaryProps {
  children: ReactNode;
  modalName: string;
  onCloseModal?: () => void;
}

export const ModalErrorBoundary: React.FC<ModalErrorBoundaryProps> = ({
  children,
  modalName,
  onCloseModal
}) => {
  const recoveryActions: ErrorRecoveryAction[] = [
    ...(onCloseModal ? [{
      label: 'Close Modal',
      action: onCloseModal,
      variant: 'secondary' as const,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    }] : [])
  ];

  return (
    <EnhancedErrorBoundary
      context={`Modal: ${modalName}`}
      enableRetry={true}
      recoveryActions={recoveryActions}
    >
      {children}
    </EnhancedErrorBoundary>
  );
};

// Async operation error boundary
interface AsyncOperationBoundaryProps {
  children: ReactNode;
  operationName: string;
  onCancel?: () => void;
  onRetry?: () => void;
}

export const AsyncOperationBoundary: React.FC<AsyncOperationBoundaryProps> = ({
  children,
  operationName,
  onCancel,
  onRetry
}) => {
  const recoveryActions: ErrorRecoveryAction[] = [
    ...(onRetry ? [{
      label: 'Retry Operation',
      action: onRetry,
      variant: 'primary' as const,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    }] : []),
    ...(onCancel ? [{
      label: 'Cancel Operation',
      action: onCancel,
      variant: 'secondary' as const,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    }] : [])
  ];

  return (
    <EnhancedErrorBoundary
      context={`Operation: ${operationName}`}
      enableRetry={true}
      recoveryActions={recoveryActions}
    >
      {children}
    </EnhancedErrorBoundary>
  );
};

// Component-specific error boundary with lazy loading support
interface ComponentErrorBoundaryProps {
  children: ReactNode;
  componentName: string;
  enableRetry?: boolean;
  fallbackComponent?: ReactNode;
  showMinimalUI?: boolean;
}

export const ComponentErrorBoundary: React.FC<ComponentErrorBoundaryProps> = ({
  children,
  componentName,
  enableRetry = true,
  fallbackComponent,
  showMinimalUI = false
}) => {
  const minimalFallback = showMinimalUI ? (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center">
        <svg className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-red-800">
          Error loading {componentName}. Please refresh the page.
        </p>
      </div>
    </div>
  ) : undefined;

  return (
    <EnhancedErrorBoundary
      context={`Component: ${componentName}`}
      enableRetry={enableRetry}
      fallback={fallbackComponent || minimalFallback}
      className={showMinimalUI ? 'block' : ''}
    >
      {children}
    </EnhancedErrorBoundary>
  );
};

// All specialized boundaries are exported inline above 
