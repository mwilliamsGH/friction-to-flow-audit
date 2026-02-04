'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

interface NeoCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
}

const NeoCheckbox = forwardRef<HTMLInputElement, NeoCheckboxProps>(
  ({ className = '', label, description, id, ...props }, ref) => {
    const checkboxId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <label
        htmlFor={checkboxId}
        className={`
          flex items-start gap-3 cursor-pointer group
          ${className}
        `}
      >
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className="neo-checkbox flex-shrink-0 mt-0.5 accent-[var(--brand-dark)]"
          {...props}
        />
        <div className="flex-1">
          <span className="text-gray-800 font-medium group-hover:text-primary transition-colors">
            {label}
          </span>
          {description && (
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      </label>
    );
  }
);

NeoCheckbox.displayName = 'NeoCheckbox';

export { NeoCheckbox };
