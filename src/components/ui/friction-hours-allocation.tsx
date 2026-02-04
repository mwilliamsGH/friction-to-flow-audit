'use client';

import { NeoSlider } from './neo-slider';
import { FrictionHours } from '@/types';
import { BRAND_COLORS } from '@/lib/colors';

// Friction labels mapping
const FRICTION_LABELS: Record<string, string> = {
  'the-pivot': 'The Pivot',
  'the-asset-hunt': 'The Asset Hunt',
  'the-versioning-loop': 'The Versioning Loop',
  'the-seasonal-rollout': 'The Seasonal Rollout',
  'the-approval-chase': 'The Approval Chase',
  'the-format-shuffle': 'The Format Shuffle',
  'the-handoff-gap': 'The Handoff Gap',
  'other': 'Other',
};

interface FrictionHoursAllocationProps {
  selectedFrictions: string[];
  value: FrictionHours;
  onChange: (value: FrictionHours) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function FrictionHoursAllocation({
  selectedFrictions,
  value,
  onChange,
  min = 0,
  max = 20,
  step = 0.5,
}: FrictionHoursAllocationProps) {
  // Calculate total hours
  const totalHours = Object.values(value).reduce((sum, hours) => sum + (hours || 0), 0);

  const handleSliderChange = (frictionType: string, hours: number) => {
    onChange({
      ...value,
      [frictionType]: hours,
    });
  };

  return (
    <div className="space-y-6">
      {/* Individual friction sliders */}
      <div className="space-y-4">
        {selectedFrictions.map((friction) => {
          const currentHours = value[friction] || 0;
          const label = FRICTION_LABELS[friction] || friction.replace(/-/g, ' ');

          return (
            <div key={friction} className="neo-card-sm p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm font-semibold text-primary">{currentHours}h / week</span>
              </div>
              <NeoSlider
                value={currentHours}
                onChange={(val) => handleSliderChange(friction, val)}
                min={min}
                max={max}
                step={step}
                minLabel="0h"
                maxLabel={`${max}h`}
              />
            </div>
          );
        })}
      </div>

      {/* Total hours summary */}
      <div className="neo-card p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-gray-700">Total Friction Hours</p>
            <p className="text-xs text-gray-500">Combined weekly friction time</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{totalHours.toFixed(1)}h</p>
            <p className="text-xs text-gray-500">per week</p>
          </div>
        </div>

        {/* Visual indicator */}
        <div className="mt-3">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min((totalHours / 40) * 100, 100)}%`,
                backgroundColor: totalHours > 20 ? BRAND_COLORS.dark : totalHours > 10 ? BRAND_COLORS.medium : BRAND_COLORS.primary,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0h</span>
            <span>10h</span>
            <span>20h</span>
            <span>30h</span>
            <span>40h+</span>
          </div>
        </div>
      </div>
    </div>
  );
}
