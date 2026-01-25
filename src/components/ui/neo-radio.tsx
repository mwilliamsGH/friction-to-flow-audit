'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

interface NeoRadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
}

const NeoRadio = forwardRef<HTMLInputElement, NeoRadioProps>(
  ({ className = '', label, description, id, ...props }, ref) => {
    const radioId = id || `${props.name}-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <label
        htmlFor={radioId}
        className={`
          flex items-start gap-3 cursor-pointer group
          ${className}
        `}
      >
        <input
          ref={ref}
          type="radio"
          id={radioId}
          className="neo-radio flex-shrink-0 mt-0.5"
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

NeoRadio.displayName = 'NeoRadio';

interface NeoRadioGroupProps {
  name: string;
  options: Array<{ value: string; label: string; description?: string }>;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const NeoRadioGroup = ({
  name,
  options,
  value,
  onChange,
  className = '',
}: NeoRadioGroupProps) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {options.map((option) => (
        <NeoRadio
          key={option.value}
          name={name}
          value={option.value}
          label={option.label}
          description={option.description}
          checked={value === option.value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      ))}
    </div>
  );
};

export { NeoRadio, NeoRadioGroup };
