'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NeoCard } from '@/components/ui/neo-card';
import { NeoButton } from '@/components/ui/neo-button';
import { NeoProgress } from '@/components/ui/neo-progress';
import { SURVEY_SECTIONS } from '@/lib/constants';
import { SurveyProgress, SurveySection } from '@/types';

const STORAGE_KEY = 'survey-progress';

const getInitialProgress = (): SurveyProgress => ({
  currentSection: 'foundation',
  completedSections: [],
  responses: {},
});

export default function SurveyWelcomePage() {
  const router = useRouter();
  const [progress, setProgress] = useState<SurveyProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load progress from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SurveyProgress;
        setProgress(parsed);
      } else {
        setProgress(getInitialProgress());
      }
    } catch {
      setProgress(getInitialProgress());
    }
    setIsLoading(false);
  }, []);

  const handleStartFresh = () => {
    const freshProgress = getInitialProgress();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(freshProgress));
    router.push('/survey/foundation');
  };

  const handleContinue = () => {
    if (progress) {
      router.push(`/survey/${progress.currentSection}`);
    }
  };

  const handleRestart = () => {
    if (confirm('Are you sure you want to start over? All your progress will be lost.')) {
      handleStartFresh();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  const hasProgress = progress && progress.completedSections.length > 0;
  const answeredQuestions = progress ? Object.keys(progress.responses).length : 0;
  const currentSectionIndex = progress
    ? SURVEY_SECTIONS.findIndex((s) => s.id === progress.currentSection)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">F2F</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Friction-to-Flow AI Audit</h1>
              <p className="text-gray-600">Discover your AI optimization opportunities</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome card */}
        <NeoCard padding="xl" className="mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary-light rounded-2xl mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {hasProgress ? 'Welcome Back!' : 'Ready to Find Your Flow?'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {hasProgress
                ? 'You have progress saved. Would you like to continue where you left off?'
                : 'This audit will help us understand your workflow, identify friction points, and discover AI opportunities tailored just for you.'}
            </p>
          </div>

          {/* Progress indicator if resuming */}
          {hasProgress && progress && (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              <NeoProgress
                currentSection={progress.currentSection}
                completedSections={progress.completedSections}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Section {currentSectionIndex + 1} of {SURVEY_SECTIONS.length}</span>
                <span>{answeredQuestions} questions answered</span>
              </div>
            </div>
          )}

          {/* Section overview */}
          {!hasProgress && (
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {SURVEY_SECTIONS.map((section, index) => (
                <div
                  key={section.id}
                  className="flex items-start gap-3 p-4 rounded-xl bg-gray-50"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{section.subtitle}</h3>
                    <p className="text-sm text-gray-600">{section.questions.length} questions</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Time estimate */}
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-8">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Takes about 10-15 minutes to complete</span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {hasProgress ? (
              <>
                <NeoButton
                  variant="primary"
                  size="lg"
                  onClick={handleContinue}
                  className="flex items-center gap-2"
                >
                  Continue Survey
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </NeoButton>
                <NeoButton
                  variant="ghost"
                  size="lg"
                  onClick={handleRestart}
                >
                  Start Over
                </NeoButton>
              </>
            ) : (
              <NeoButton
                variant="primary"
                size="lg"
                onClick={handleStartFresh}
                className="flex items-center gap-2"
              >
                Begin Audit
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </NeoButton>
            )}
          </div>
        </NeoCard>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <NeoCard padding="lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Confidential</h3>
            </div>
            <p className="text-sm text-gray-600">
              Your responses are kept private and secure. We never share individual data.
            </p>
          </NeoCard>

          <NeoCard padding="lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Auto-Save</h3>
            </div>
            <p className="text-sm text-gray-600">
              Your progress is automatically saved. Come back anytime to continue.
            </p>
          </NeoCard>

          <NeoCard padding="lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Personalized</h3>
            </div>
            <p className="text-sm text-gray-600">
              Get AI recommendations tailored to your specific workflow and goals.
            </p>
          </NeoCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8 border-t border-gray-200 mt-8">
        <p className="text-center text-sm text-gray-500">
          By starting the audit, you agree to our terms of service and privacy policy.
        </p>
      </footer>
    </div>
  );
}
