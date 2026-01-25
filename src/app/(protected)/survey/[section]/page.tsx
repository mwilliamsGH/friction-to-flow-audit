'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { SurveyLayout } from '@/components/survey/survey-layout';
import { SectionIntro } from '@/components/survey/section-intro';
import { QuestionRenderer } from '@/components/survey/question-renderer';
import { SURVEY_SECTIONS, SURVEY_QUESTIONS } from '@/lib/constants';
import {
  SurveyProgress,
  SurveySection,
  PartialSurveyResponses,
  TimeAllocation,
  QuestionConfig,
} from '@/types';

const STORAGE_KEY = 'survey-progress';

const getInitialProgress = (): SurveyProgress => ({
  currentSection: 'foundation',
  completedSections: [],
  responses: {},
});

interface SectionPageProps {
  params: Promise<{ section: string }>;
}

export default function SectionPage({ params }: SectionPageProps) {
  const { section: sectionParam } = use(params);
  const router = useRouter();
  const [progress, setProgress] = useState<SurveyProgress | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Find the current section config
  const sectionConfig = SURVEY_SECTIONS.find((s) => s.id === sectionParam);
  const sectionIndex = SURVEY_SECTIONS.findIndex((s) => s.id === sectionParam);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SurveyProgress;
        setProgress(parsed);
        // Show intro if this section hasn't been started
        const sectionQuestions = sectionConfig?.questions || [];
        const hasAnsweredAny = sectionQuestions.some((qId) => {
          const qConfig = SURVEY_QUESTIONS[qId];
          return qConfig && parsed.responses[qConfig.key as keyof PartialSurveyResponses] !== undefined;
        });
        setShowIntro(!hasAnsweredAny);
      } else {
        setProgress(getInitialProgress());
      }
    } catch {
      setProgress(getInitialProgress());
    }
    setIsLoading(false);
  }, [sectionConfig?.questions]);

  // Save progress to localStorage
  const saveProgress = useCallback((newProgress: SurveyProgress) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    setProgress(newProgress);
  }, []);

  // Handle response changes with auto-save
  const handleResponseChange = useCallback(
    (key: string, value: string | string[] | number | TimeAllocation) => {
      if (!progress) return;

      const newResponses = {
        ...progress.responses,
        [key]: value,
      } as PartialSurveyResponses;

      const newProgress: SurveyProgress = {
        ...progress,
        responses: newResponses,
        currentSection: sectionParam as SurveySection,
      };

      saveProgress(newProgress);

      // Clear error for this field if it exists
      if (errors[key]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[key];
          return newErrors;
        });
      }
    },
    [progress, saveProgress, sectionParam, errors]
  );

  // Validate section before navigation
  const validateSection = useCallback((): boolean => {
    if (!sectionConfig || !progress) return false;

    const newErrors: Record<string, string> = {};

    sectionConfig.questions.forEach((qId) => {
      const question = SURVEY_QUESTIONS[qId];
      if (!question) return;

      // Check conditional visibility
      if (question.conditionalOn) {
        const { questionKey, showWhenHasValue } = question.conditionalOn;
        const dependentValue = progress.responses[questionKey as keyof PartialSurveyResponses];

        if (showWhenHasValue) {
          const shouldShow = Array.isArray(dependentValue)
            ? dependentValue.length > 0
            : !!dependentValue;
          if (!shouldShow) return; // Skip validation if question is not visible
        }
      }

      const value = progress.responses[question.key as keyof PartialSurveyResponses];

      // Required field validation
      if (question.required) {
        if (value === undefined || value === null || value === '') {
          newErrors[question.key] = 'This field is required';
          return;
        }

        if (Array.isArray(value) && value.length === 0) {
          newErrors[question.key] = 'Please select at least one option';
          return;
        }
      }

      // Type-specific validation
      if (question.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value as string)) {
          newErrors[question.key] = 'Please enter a valid email address';
        }
      }

      if (question.type === 'text' && question.validation?.minLength && value) {
        if ((value as string).length < question.validation.minLength) {
          newErrors[question.key] = `Must be at least ${question.validation.minLength} characters`;
        }
      }

      if (question.type === 'multi-select' && question.validation?.minSelections && value) {
        if ((value as string[]).length < question.validation.minSelections) {
          newErrors[question.key] = `Please select at least ${question.validation.minSelections} option(s)`;
        }
      }

      if (question.type === 'percentage-allocation' && value) {
        const allocation = value as TimeAllocation;
        const total = Object.values(allocation).reduce((sum, v) => sum + v, 0);
        if (total !== 100) {
          newErrors[question.key] = 'Allocation must total 100%';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [sectionConfig, progress]);

  // Handle next section navigation
  const handleNext = useCallback(async () => {
    if (!validateSection() || !progress) return;

    setIsSaving(true);

    // Mark current section as completed
    const completedSections = progress.completedSections.includes(sectionParam as SurveySection)
      ? progress.completedSections
      : [...progress.completedSections, sectionParam as SurveySection];

    // Determine next section
    const nextSectionIndex = sectionIndex + 1;
    const isLastSection = nextSectionIndex >= SURVEY_SECTIONS.length;

    if (isLastSection) {
      // Save final progress and go to complete page
      const finalProgress: SurveyProgress = {
        ...progress,
        completedSections,
        currentSection: sectionParam as SurveySection,
      };
      saveProgress(finalProgress);
      router.push('/survey/complete');
    } else {
      // Navigate to next section
      const nextSection = SURVEY_SECTIONS[nextSectionIndex];
      const newProgress: SurveyProgress = {
        ...progress,
        completedSections,
        currentSection: nextSection.id,
      };
      saveProgress(newProgress);
      router.push(`/survey/${nextSection.id}`);
    }

    setIsSaving(false);
  }, [validateSection, progress, sectionIndex, sectionParam, saveProgress, router]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (sectionIndex === 0) {
      router.push('/survey');
    } else {
      const prevSection = SURVEY_SECTIONS[sectionIndex - 1];
      router.push(`/survey/${prevSection.id}`);
    }
  }, [sectionIndex, router]);

  // Handle starting section (dismissing intro)
  const handleStartSection = () => {
    setShowIntro(false);
  };

  // Loading state
  if (isLoading || !progress) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  // Invalid section
  if (!sectionConfig) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Section Not Found</h1>
          <button
            onClick={() => router.push('/survey')}
            className="text-primary hover:underline"
          >
            Return to Survey
          </button>
        </div>
      </div>
    );
  }

  // Get visible questions (respecting conditionalOn)
  const visibleQuestions = sectionConfig.questions
    .map((qId) => SURVEY_QUESTIONS[qId])
    .filter((q): q is QuestionConfig => {
      if (!q) return false;

      if (q.conditionalOn) {
        const { questionKey, showWhenHasValue } = q.conditionalOn;
        const dependentValue = progress.responses[questionKey as keyof PartialSurveyResponses];

        if (showWhenHasValue) {
          if (Array.isArray(dependentValue)) {
            return dependentValue.length > 0;
          }
          return !!dependentValue;
        }
      }

      return true;
    });

  // Calculate if next button should be disabled
  const hasRequiredErrors = Object.keys(errors).length > 0;
  const isLastSection = sectionIndex === SURVEY_SECTIONS.length - 1;

  return (
    <SurveyLayout
      currentSection={sectionParam as SurveySection}
      completedSections={progress.completedSections}
      onBack={handleBack}
      onNext={handleNext}
      nextLabel={isLastSection ? 'Complete Survey' : 'Next Section'}
      backLabel={sectionIndex === 0 ? 'Exit' : 'Back'}
      isNextDisabled={hasRequiredErrors}
      isLoading={isSaving}
      showNavigation={!showIntro}
    >
      {showIntro ? (
        <SectionIntro
          section={sectionConfig}
          questionCount={visibleQuestions.length}
          onStart={handleStartSection}
          isFirstSection={sectionIndex === 0}
        />
      ) : (
        <div className="space-y-8">
          {/* Section header */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>{sectionConfig.title}</span>
              <span>/</span>
              <span className="font-medium text-primary">{sectionConfig.subtitle}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{sectionConfig.introTitle}</h2>
            <p className="text-gray-600 mt-1">{sectionConfig.introDescription}</p>
          </div>

          {/* Questions */}
          <div className="space-y-10">
            {visibleQuestions.map((question, index) => (
              <div
                key={question.id}
                className="pb-8 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <QuestionRenderer
                      question={question}
                      value={progress.responses[question.key as keyof PartialSurveyResponses]}
                      onChange={handleResponseChange}
                      error={errors[question.key]}
                      responses={progress.responses}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Validation error summary */}
          {Object.keys(errors).length > 0 && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-medium text-red-700">Please fix the following errors:</p>
                  <ul className="mt-1 text-sm text-red-600 list-disc list-inside">
                    {Object.entries(errors).map(([key, message]) => (
                      <li key={key}>{message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </SurveyLayout>
  );
}
