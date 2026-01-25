'use client';

import { useState, useEffect } from 'react';
import { TimeAllocation } from '@/types';

interface PercentageAllocationProps {
  categories: string[];
  value?: TimeAllocation;
  onChange?: (allocation: TimeAllocation) => void;
  error?: string;
  className?: string;
}

const categoryKeys: (keyof TimeAllocation)[] = ['creative', 'production', 'communication', 'admin'];

const PercentageAllocation = ({
  categories,
  value,
  onChange,
  error,
  className = '',
}: PercentageAllocationProps) => {
  const [allocation, setAllocation] = useState<TimeAllocation>(
    value || { creative: 25, production: 25, communication: 25, admin: 25 }
  );

  useEffect(() => {
    if (value) {
      setAllocation(value);
    }
  }, [value]);

  const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);

  const handleChange = (key: keyof TimeAllocation, newValue: number) => {
    // Ensure value is between 0 and 100
    const clampedValue = Math.max(0, Math.min(100, newValue));

    const newAllocation = {
      ...allocation,
      [key]: clampedValue,
    };

    setAllocation(newAllocation);
    onChange?.(newAllocation);
  };

  const handleSliderChange = (key: keyof TimeAllocation, newValue: number) => {
    // Smart redistribution: adjust other values proportionally
    const currentValue = allocation[key];
    const diff = newValue - currentValue;

    if (diff === 0) return;

    const otherKeys = categoryKeys.filter((k) => k !== key);
    const otherTotal = otherKeys.reduce((sum, k) => sum + allocation[k], 0);

    let newAllocation: TimeAllocation;

    if (otherTotal === 0) {
      // All other values are 0, just set this one
      newAllocation = {
        creative: 0,
        production: 0,
        communication: 0,
        admin: 0,
        [key]: newValue,
      };
    } else {
      // Distribute the difference proportionally among other categories
      newAllocation = { ...allocation, [key]: newValue };
      const remaining = 100 - newValue;

      otherKeys.forEach((k) => {
        const proportion = allocation[k] / otherTotal;
        newAllocation[k] = Math.round(remaining * proportion);
      });

      // Handle rounding errors
      const newTotal = Object.values(newAllocation).reduce((sum, val) => sum + val, 0);
      if (newTotal !== 100) {
        const adjustment = 100 - newTotal;
        // Add adjustment to the largest other category
        const largestOther = otherKeys.reduce((a, b) =>
          newAllocation[a] >= newAllocation[b] ? a : b
        );
        newAllocation[largestOther] += adjustment;
      }
    }

    setAllocation(newAllocation);
    onChange?.(newAllocation);
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      { bg: 'bg-primary', light: 'bg-blue-100' },
      { bg: 'bg-accent-green', light: 'bg-green-100' },
      { bg: 'bg-accent-orange', light: 'bg-orange-100' },
      { bg: 'bg-accent-purple', light: 'bg-purple-100' },
    ];
    return colors[index];
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Total indicator */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-600">
          Total must equal 100%
        </span>
        <span
          className={`
            neo-card-sm px-3 py-1 text-sm font-semibold
            ${total === 100 ? 'text-accent-green' : 'text-accent-red'}
          `}
        >
          {total}%
        </span>
      </div>

      {/* Category sliders */}
      <div className="space-y-6">
        {categories.map((category, index) => {
          const key = categoryKeys[index];
          const color = getCategoryColor(index);

          return (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  {category}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={allocation[key]}
                    onChange={(e) => handleChange(key, parseInt(e.target.value) || 0)}
                    className="w-16 neo-inset px-2 py-1 text-center text-sm font-semibold"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
              <div className="relative h-3 neo-inset rounded-lg overflow-hidden">
                <div
                  className={`h-full ${color.bg} rounded-lg transition-all duration-200`}
                  style={{ width: `${allocation[key]}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={allocation[key]}
                onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
                className="w-full opacity-0 absolute cursor-pointer"
                style={{ marginTop: '-24px', height: '24px' }}
              />
            </div>
          );
        })}
      </div>

      {/* Visual breakdown */}
      <div className="mt-6">
        <div className="flex h-4 rounded-lg overflow-hidden neo-inset">
          {categoryKeys.map((key, index) => {
            const color = getCategoryColor(index);
            return (
              <div
                key={key}
                className={`${color.bg} transition-all duration-300`}
                style={{ width: `${allocation[key]}%` }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          {categories.map((category, index) => {
            const key = categoryKeys[index];
            const color = getCategoryColor(index);
            return (
              <div key={key} className="flex items-center gap-1 text-xs text-gray-500">
                <div className={`w-2 h-2 rounded-full ${color.bg}`} />
                <span>{allocation[key]}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-accent-red">{error}</p>}
      {total !== 100 && (
        <p className="mt-2 text-sm text-accent-orange">
          Please adjust values to total 100% (currently {total}%)
        </p>
      )}
    </div>
  );
};

export { PercentageAllocation };
