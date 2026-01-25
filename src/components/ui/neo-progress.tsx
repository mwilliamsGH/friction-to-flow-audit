'use client';

import { SurveySection } from '@/types';
import { SURVEY_SECTIONS } from '@/lib/constants';

interface NeoProgressProps {
  currentSection: SurveySection;
  completedSections: SurveySection[];
  className?: string;
}

const NeoProgress = ({
  currentSection,
  completedSections,
  className = '',
}: NeoProgressProps) => {
  const currentIndex = SURVEY_SECTIONS.findIndex((s) => s.id === currentSection);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Progress
        </span>
        <span className="text-xs font-semibold text-primary">
          Section {currentIndex + 1} of {SURVEY_SECTIONS.length}
        </span>
      </div>
      <div className="flex gap-2">
        {SURVEY_SECTIONS.map((section, index) => {
          const isCompleted = completedSections.includes(section.id);
          const isCurrent = section.id === currentSection;
          const isPast = index < currentIndex;

          return (
            <div
              key={section.id}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div
                className={`
                  h-2 w-full rounded-full transition-all duration-300
                  ${
                    isCompleted || isPast
                      ? 'bg-primary'
                      : isCurrent
                      ? 'bg-gradient-to-r from-primary to-primary-light'
                      : 'neo-inset'
                  }
                `}
              />
              <span
                className={`
                  text-xs font-medium transition-colors
                  ${isCurrent ? 'text-primary' : isCompleted || isPast ? 'text-gray-600' : 'text-gray-400'}
                `}
              >
                {section.subtitle}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface NeoLinearProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'green' | 'orange' | 'red';
  className?: string;
}

const NeoLinearProgress = ({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  color = 'primary',
  className = '',
}: NeoLinearProgressProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    primary: 'from-primary to-primary-light',
    green: 'from-accent-green to-green-400',
    orange: 'from-accent-orange to-orange-400',
    red: 'from-accent-red to-red-400',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-gray-600">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`neo-progress-bar ${heightClasses[size]}`}>
        <div
          className={`neo-progress-fill bg-gradient-to-r ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export { NeoProgress, NeoLinearProgress };
