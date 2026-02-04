'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { NeoCard } from '@/components/ui/neo-card';
import { NeoButton } from '@/components/ui/neo-button';
import { NeoLinearProgress } from '@/components/ui/neo-progress';
import { SURVEY_SECTIONS } from '@/lib/constants';
import { SurveyProgress, SurveySection } from '@/types';
import { createSupabaseBrowserClient } from '@/lib/supabase';

const STORAGE_KEY = 'survey-progress';

type ProcessingStage =
  | 'validating'
  | 'analyzing'
  | 'identifying'
  | 'generating'
  | 'complete'
  | 'error';

interface StageConfig {
  label: string;
  description: string;
  progress: number;
}

const STAGES: Record<ProcessingStage, StageConfig> = {
  validating: {
    label: 'Validating Responses',
    description: 'Checking your answers for completeness...',
    progress: 20,
  },
  analyzing: {
    label: 'Analyzing Patterns',
    description: 'Identifying friction loops and opportunities...',
    progress: 40,
  },
  identifying: {
    label: 'Determining Your Archetype',
    description: 'Matching your profile to workflow patterns...',
    progress: 60,
  },
  generating: {
    label: 'Generating Recommendations',
    description: 'Creating personalized AI insights...',
    progress: 80,
  },
  complete: {
    label: 'Analysis Complete',
    description: 'Your results are ready!',
    progress: 100,
  },
  error: {
    label: 'Error',
    description: 'Something went wrong. Please try again.',
    progress: 0,
  },
};

export default function SurveyCompletePage() {
  const router = useRouter();
  const [stage, setStage] = useState<ProcessingStage>('validating');
  const [progress, setProgress] = useState<SurveyProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValidSurvey, setIsValidSurvey] = useState(false);

  // Load and validate survey progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setError('No survey data found. Please complete the survey first.');
        setStage('error');
        return;
      }

      const parsed = JSON.parse(saved) as SurveyProgress;
      setProgress(parsed);

      // Check if all sections are completed
      const allSectionsCompleted = SURVEY_SECTIONS.every((section) =>
        parsed.completedSections.includes(section.id)
      );

      if (!allSectionsCompleted) {
        // Find first incomplete section
        const incompleteSection = SURVEY_SECTIONS.find(
          (section) => !parsed.completedSections.includes(section.id)
        );
        if (incompleteSection) {
          setError(`Please complete all sections. You still need to finish "${incompleteSection.subtitle}".`);
          setStage('error');
          return;
        }
      }

      setIsValidSurvey(true);
    } catch {
      setError('Failed to load survey data. Please try again.');
      setStage('error');
    }
  }, []);

  // Simulate processing stages
  const processResults = useCallback(async () => {
    if (!isValidSurvey || !progress) return;

    const stageOrder: ProcessingStage[] = ['validating', 'analyzing', 'identifying', 'generating', 'complete'];
    const stageDelays = [1500, 2000, 2000, 2500];

    for (let i = 0; i < stageOrder.length; i++) {
      setStage(stageOrder[i]);

      if (i < stageDelays.length) {
        await new Promise((resolve) => setTimeout(resolve, stageDelays[i]));
      }
    }

    // After processing, call the API to generate results
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('You must be logged in to save your results.');
      }

      // 1. Save the survey response to the database
      // This is required before generation since the API route expects a responseId
      const { data: surveyData, error: saveError } = await (supabase as any)
        .from('survey_responses')
        .insert({
          user_id: user.id,
          responses: progress.responses,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (saveError) {
        throw new Error(saveError.message || 'Failed to save survey responses');
      }

      // 2. Call the generation API with the saved response ID
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responseId: surveyData.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate results');
      }

      const result = await response.json();

      // Store results and redirect to dashboard
      localStorage.setItem('audit-results', JSON.stringify(result));

      // Clear survey progress now that it's complete and saved
      localStorage.removeItem(STORAGE_KEY);

      // Small delay before redirect for UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to dashboard with results
      router.push('/dashboard');
    } catch (err) {
      console.error('Error generating results:', err);
      // Even on API error, redirect to dashboard - it can handle missing data
      router.push('/dashboard');
    }
  }, [isValidSurvey, progress, router]);

  // Start processing when valid
  useEffect(() => {
    if (isValidSurvey) {
      processResults();
    }
  }, [isValidSurvey, processResults]);

  // Handle going back to incomplete section
  const handleReturnToSurvey = () => {
    if (!progress) {
      router.push('/survey');
      return;
    }

    const incompleteSection = SURVEY_SECTIONS.find(
      (section) => !progress.completedSections.includes(section.id)
    );

    if (incompleteSection) {
      router.push(`/survey/${incompleteSection.id}`);
    } else {
      router.push('/survey');
    }
  };

  // Handle retry on error
  const handleRetry = () => {
    setError(null);
    setStage('validating');
    window.location.reload();
  };

  const currentStage = STAGES[stage];

  // Error state
  if (stage === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <NeoCard padding="xl" className="max-w-lg w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-brand-lightest rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Process</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NeoButton variant="primary" onClick={handleReturnToSurvey}>
              Return to Survey
            </NeoButton>
            <NeoButton variant="ghost" onClick={handleRetry}>
              Try Again
            </NeoButton>
          </div>
        </NeoCard>
      </div>
    );
  }

  // Processing states
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <NeoCard padding="xl" className="max-w-lg w-full">
        <div className="text-center">
          {/* Animated icon */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            {stage === 'complete' ? (
              <div className="w-full h-full bg-brand-lightest rounded-full flex items-center justify-center animate-scale-in">
                <svg className="w-12 h-12 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center animate-pulse">
                  <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Stage info */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {currentStage.label}
          </h1>
          <p className="text-gray-600 mb-8">
            {currentStage.description}
          </p>

          {/* Progress bar */}
          <NeoLinearProgress
            value={currentStage.progress}
            max={100}
            showValue
            size="lg"
            color="primary"
            className="mb-8"
          />

          {/* Stage indicators */}
          <div className="flex justify-between items-center">
            {(['validating', 'analyzing', 'identifying', 'generating'] as ProcessingStage[]).map((s, index) => {
              const stageIndex = ['validating', 'analyzing', 'identifying', 'generating'].indexOf(stage);
              const isComplete = index < stageIndex || stage === 'complete';
              const isCurrent = s === stage;

              return (
                <div key={s} className="flex flex-col items-center">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                      ${isComplete ? 'bg-brand-lightest text-brand-primary' : isCurrent ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}
                    `}
                  >
                    {isComplete ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`text-xs mt-1 ${isCurrent ? 'text-primary font-medium' : 'text-gray-400'}`}>
                    {['Validate', 'Analyze', 'Profile', 'Generate'][index]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Completion message */}
          {stage === 'complete' && (
            <div className="mt-8 p-4 bg-brand-lightest rounded-xl border border-brand-light">
              <p className="text-brand-dark font-medium">
                Your personalized AI audit is ready! Redirecting to your dashboard...
              </p>
            </div>
          )}
        </div>
      </NeoCard>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-light/5 rounded-full blur-3xl" />
      </div>

      {/* Inline styles for animations */}
      <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
