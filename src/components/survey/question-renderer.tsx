'use client';

import { NeoInput } from '@/components/ui/neo-input';
import { NeoTextarea } from '@/components/ui/neo-textarea';
import { NeoSelect } from '@/components/ui/neo-select';
import { NeoRadioGroup } from '@/components/ui/neo-radio';
import { NeoCheckbox } from '@/components/ui/neo-checkbox';
import { NeoSlider } from '@/components/ui/neo-slider';
import { PercentageAllocation } from '@/components/ui/percentage-allocation';
import { FrictionHoursAllocation } from '@/components/ui/friction-hours-allocation';
import { QuestionConfig, TimeAllocation, FrictionHours, PartialSurveyResponses } from '@/types';

interface QuestionRendererProps {
  question: QuestionConfig;
  value: string | string[] | number | TimeAllocation | FrictionHours | undefined;
  onChange: (key: string, value: string | string[] | number | TimeAllocation | FrictionHours) => void;
  error?: string;
  responses?: PartialSurveyResponses;
}

const QuestionRenderer = ({
  question,
  value,
  onChange,
  error,
  responses,
}: QuestionRendererProps) => {
  // Check if question should be shown based on conditionalOn
  const shouldShowQuestion = () => {
    if (!question.conditionalOn) return true;

    const { questionKey, showWhenHasValue } = question.conditionalOn;
    const dependentValue = responses?.[questionKey as keyof PartialSurveyResponses];

    if (showWhenHasValue) {
      // Show if the dependent value exists and has content
      if (Array.isArray(dependentValue)) {
        return dependentValue.length > 0;
      }
      return !!dependentValue;
    }

    return true;
  };

  if (!shouldShowQuestion()) {
    return null;
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(question.key, e.target.value);
  };

  const handleSelectChange = (val: string) => {
    onChange(question.key, val);
  };

  const handleRadioChange = (val: string) => {
    onChange(question.key, val);
  };

  const handleSliderChange = (val: number) => {
    onChange(question.key, val);
  };

  const handleMultiSelectChange = (optionValue: string, checked: boolean) => {
    const currentValue = (value as string[]) || [];
    let newValue: string[];

    if (checked) {
      // Check max selections constraint
      if (question.validation?.maxSelections && currentValue.length >= question.validation.maxSelections) {
        return;
      }
      newValue = [...currentValue, optionValue];
    } else {
      newValue = currentValue.filter((v) => v !== optionValue);
    }

    onChange(question.key, newValue);
  };

  const handlePercentageChange = (allocation: TimeAllocation) => {
    onChange(question.key, allocation);
  };

  const handleFrictionHoursChange = (frictionHours: FrictionHours) => {
    onChange(question.key, frictionHours);
  };

  const handleOtherTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (question.otherKey) {
      onChange(question.otherKey, e.target.value);
    }
  };

  // Get the "other" text value from responses
  const otherValue = question.otherKey
    ? (responses?.[question.otherKey as keyof PartialSurveyResponses] as string) || ''
    : '';

  // Check if "other" is selected
  const isOtherSelected = () => {
    if (Array.isArray(value)) {
      return value.includes('other');
    }
    return value === 'other';
  };

  const renderOtherInput = () => {
    if (!question.otherKey || !isOtherSelected()) {
      return null;
    }

    return (
      <div className="mt-3 ml-8">
        <NeoInput
          value={otherValue}
          onChange={handleOtherTextChange}
          placeholder="Please specify..."
          className="max-w-md"
        />
      </div>
    );
  };

  const renderQuestionLabel = () => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {question.question}
        {question.required && <span className="text-accent-red ml-1">*</span>}
      </h3>
      {question.description && (
        <p className="text-sm text-gray-600 mt-1">{question.description}</p>
      )}
    </div>
  );

  switch (question.type) {
    case 'text':
      return (
        <div className="space-y-2">
          {renderQuestionLabel()}
          <NeoInput
            value={(value as string) || ''}
            onChange={handleTextChange}
            placeholder={question.placeholder}
            error={error}
            required={question.required}
          />
        </div>
      );

    case 'email':
      return (
        <div className="space-y-2">
          {renderQuestionLabel()}
          <NeoInput
            type="email"
            value={(value as string) || ''}
            onChange={handleTextChange}
            placeholder={question.placeholder}
            error={error}
            required={question.required}
          />
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-2">
          {renderQuestionLabel()}
          <NeoTextarea
            value={(value as string) || ''}
            onChange={handleTextChange}
            placeholder={question.placeholder}
            error={error}
            required={question.required}
            maxLength={question.validation?.maxLength}
            showCharCount={!!question.validation?.maxLength}
          />
        </div>
      );

    case 'dropdown':
      return (
        <div className="space-y-2">
          {renderQuestionLabel()}
          <NeoSelect
            value={(value as string) || ''}
            onChange={handleSelectChange}
            options={question.options || []}
            placeholder="Select an option"
            error={error}
            required={question.required}
          />
          {renderOtherInput()}
        </div>
      );

    case 'radio':
      return (
        <div className="space-y-2">
          {renderQuestionLabel()}
          <NeoRadioGroup
            name={question.key}
            value={(value as string) || ''}
            onChange={handleRadioChange}
            options={question.options || []}
          />
          {renderOtherInput()}
          {error && <p className="text-sm text-accent-red mt-2">{error}</p>}
        </div>
      );

    case 'multi-select':
      const selectedValues = (value as string[]) || [];
      const maxReached = question.validation?.maxSelections
        ? selectedValues.length >= question.validation.maxSelections
        : false;

      return (
        <div className="space-y-2">
          {renderQuestionLabel()}
          {question.validation?.maxSelections && (
            <p className="text-sm text-gray-500 mb-3">
              Select up to {question.validation.maxSelections} options
              {selectedValues.length > 0 && ` (${selectedValues.length} selected)`}
            </p>
          )}
          <div className="space-y-3">
            {question.options?.map((option) => {
              const isChecked = selectedValues.includes(option.value);
              const isDisabled = maxReached && !isChecked;

              return (
                <div key={option.value}>
                  <NeoCheckbox
                    label={option.label}
                    description={option.description}
                    checked={isChecked}
                    disabled={isDisabled}
                    onChange={(e) => handleMultiSelectChange(option.value, e.target.checked)}
                    className={isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                  />
                  {/* Show "other" input inline after the checkbox */}
                  {option.value === 'other' && isChecked && question.otherKey && (
                    <div className="mt-2 ml-8">
                      <NeoInput
                        value={otherValue}
                        onChange={handleOtherTextChange}
                        placeholder="Please specify..."
                        className="max-w-md"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {error && <p className="text-sm text-accent-red mt-2">{error}</p>}
        </div>
      );

    case 'slider':
      return (
        <div className="space-y-2">
          {renderQuestionLabel()}
          <NeoSlider
            value={(value as number) ?? question.validation?.min ?? 0}
            onChange={handleSliderChange}
            min={question.validation?.min ?? 0}
            max={question.validation?.max ?? 10}
            step={question.validation?.step ?? 1}
            minLabel={question.sliderLabels?.min}
            maxLabel={question.sliderLabels?.max}
          />
          {error && <p className="text-sm text-accent-red mt-2">{error}</p>}
        </div>
      );

    case 'percentage-allocation':
      return (
        <div className="space-y-2">
          {renderQuestionLabel()}
          <PercentageAllocation
            categories={question.categories || []}
            value={value as TimeAllocation}
            onChange={handlePercentageChange}
            error={error}
          />
        </div>
      );

    case 'friction-hours-allocation':
      // Get selected friction types from the source question
      const frictionSourceKey = question.frictionSourceKey as keyof PartialSurveyResponses;
      const selectedFrictions = (responses?.[frictionSourceKey] as string[]) || [];

      // Only show if there are selected frictions
      if (selectedFrictions.length === 0) {
        return (
          <div className="space-y-2">
            {renderQuestionLabel()}
            <p className="text-sm text-gray-500 italic">
              Please select friction types in the previous question first.
            </p>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          {renderQuestionLabel()}
          <FrictionHoursAllocation
            selectedFrictions={selectedFrictions}
            value={(value as FrictionHours) || {}}
            onChange={handleFrictionHoursChange}
            min={question.validation?.min ?? 0}
            max={question.validation?.max ?? 20}
            step={question.validation?.step ?? 0.5}
          />
          {error && <p className="text-sm text-accent-red mt-2">{error}</p>}
        </div>
      );

    default:
      return (
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-yellow-700">
            Unknown question type: {question.type}
          </p>
        </div>
      );
  }
};

export { QuestionRenderer };
