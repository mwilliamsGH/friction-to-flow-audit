'use client';

import { forwardRef, TextareaHTMLAttributes } from 'react';

interface NeoTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCharCount?: boolean;
}

const NeoTextarea = forwardRef<HTMLTextAreaElement, NeoTextareaProps>(
  (
    {
      className = '',
      label,
      error,
      helperText,
      showCharCount = false,
      maxLength,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {props.required && <span className="text-accent-red ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          maxLength={maxLength}
          className={`
            neo-input
            w-full
            min-h-[100px]
            resize-y
            text-gray-900
            placeholder:text-gray-400
            ${error ? 'ring-2 ring-accent-red' : ''}
            ${className}
          `}
          {...props}
        />
        <div className="flex justify-between mt-1">
          {error && <p className="text-sm text-accent-red">{error}</p>}
          {helperText && !error && (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
          {showCharCount && maxLength && (
            <p className={`text-xs ml-auto ${charCount > maxLength * 0.9 ? 'text-accent-orange' : 'text-gray-400'}`}>
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

NeoTextarea.displayName = 'NeoTextarea';

export { NeoTextarea };
