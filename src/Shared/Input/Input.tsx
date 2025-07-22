import React, { forwardRef, InputHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
  id,
  ...props
}, ref) => {
  const baseClasses = 'border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500';
  
  const variantClasses = {
    default: 'border-gray-300 bg-white hover:border-gray-400',
    outlined: 'border-2 border-gray-300 bg-transparent hover:border-gray-400',
    filled: 'border-0 bg-gray-100 hover:bg-gray-200'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg'
  };

  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';
  const widthClasses = fullWidth ? 'w-full' : '';

  const inputClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${errorClasses}
    ${widthClasses}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${className}
    rounded-md
  `.trim().replace(/\s+/g, ' ');

  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`flex flex-col ${fullWidth ? 'w-full' : ''}`}>
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {rightIcon}
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ErrorMessage>{error.message}</ErrorMessage>
          </div>
        )}
      </div>
      
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
      
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
