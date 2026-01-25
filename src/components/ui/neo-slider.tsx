'use client';

import { forwardRef, InputHTMLAttributes, useState, useEffect } from 'react';

interface NeoSliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  minLabel?: string;
  maxLabel?: string;
  showValue?: boolean;
  onChange?: (value: number) => void;
}

const NeoSlider = forwardRef<HTMLInputElement, NeoSliderProps>(
  (
    {
      className = '',
      label,
      minLabel,
      maxLabel,
      showValue = true,
      min = 0,
      max = 10,
      step = 1,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(
      value !== undefined ? Number(value) : defaultValue !== undefined ? Number(defaultValue) : Number(min)
    );

    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(Number(value));
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      setInternalValue(newValue);
      onChange?.(newValue);
    };

    const percentage = ((internalValue - Number(min)) / (Number(max) - Number(min))) * 100;

    return (
      <div className={`w-full ${className}`}>
        {(label || showValue) && (
          <div className="flex justify-between items-center mb-3">
            {label && (
              <span className="text-sm font-medium text-gray-700">{label}</span>
            )}
            {showValue && (
              <span className="neo-card-sm px-3 py-1 text-sm font-semibold text-primary">
                {internalValue} / {max}
              </span>
            )}
          </div>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={internalValue}
            onChange={handleChange}
            className="neo-slider w-full"
            style={{
              background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, var(--background) ${percentage}%, var(--background) 100%)`,
            }}
            {...props}
          />
        </div>
        {(minLabel || maxLabel) && (
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{minLabel}</span>
            <span>{maxLabel}</span>
          </div>
        )}
      </div>
    );
  }
);

NeoSlider.displayName = 'NeoSlider';

export { NeoSlider };
