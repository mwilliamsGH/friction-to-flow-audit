'use client';

import { forwardRef, SelectHTMLAttributes, useState, useRef, useEffect } from 'react';

interface NeoSelectOption {
  value: string;
  label: string;
}

interface NeoSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  options: NeoSelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

const NeoSelect = forwardRef<HTMLSelectElement, NeoSelectProps>(
  (
    {
      className = '',
      label,
      error,
      options,
      placeholder = 'Select an option',
      value,
      onChange,
      id,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || '');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value as string);
      }
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue);
      onChange?.(optionValue);
      setIsOpen(false);
    };

    const selectedOption = options.find((opt) => opt.value === selectedValue);

    return (
      <div className="w-full" ref={dropdownRef}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {props.required && <span className="text-accent-red ml-1">*</span>}
          </label>
        )}

        {/* Hidden native select for form submission */}
        <select
          ref={ref}
          id={selectId}
          value={selectedValue}
          onChange={(e) => handleSelect(e.target.value)}
          className="sr-only"
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom styled dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`
              neo-input
              w-full
              text-left
              flex items-center justify-between
              ${!selectedValue ? 'text-gray-400' : 'text-gray-900'}
              ${error ? 'ring-2 ring-accent-red' : ''}
              ${className}
            `}
          >
            <span>{selectedOption?.label || placeholder}</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-2 neo-card p-2 max-h-60 overflow-auto animate-fade-in">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg transition-colors
                    ${
                      option.value === selectedValue
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-accent-red">{error}</p>}
      </div>
    );
  }
);

NeoSelect.displayName = 'NeoSelect';

export { NeoSelect };
