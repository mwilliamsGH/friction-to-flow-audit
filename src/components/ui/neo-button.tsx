'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';

interface NeoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const NeoButton = forwardRef<HTMLButtonElement, NeoButtonProps>(
  (
    {
      className = '',
      variant = 'default',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClass =
      variant === 'primary'
        ? 'neo-button-primary'
        : variant === 'ghost'
        ? 'hover:bg-gray-100 rounded-lg transition-colors'
        : 'neo-button';

    const variantStyles =
      variant === 'secondary'
        ? 'border-2 border-primary text-primary'
        : variant === 'ghost'
        ? 'text-gray-600 hover:text-gray-900'
        : '';

    return (
      <button
        ref={ref}
        className={`
          ${baseClass}
          ${sizeClasses[size]}
          ${variantStyles}
          ${fullWidth ? 'w-full' : ''}
          font-medium
          inline-flex items-center justify-center gap-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

NeoButton.displayName = 'NeoButton';

export { NeoButton };
