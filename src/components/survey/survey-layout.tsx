'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { NeoCard } from '@/components/ui/neo-card';
import { NeoButton } from '@/components/ui/neo-button';
import { NeoProgress } from '@/components/ui/neo-progress';
import { SURVEY_SECTIONS } from '@/lib/constants';
import { SurveySection } from '@/types';

interface SurveyLayoutProps {
  children: ReactNode;
  currentSection: SurveySection;
  completedSections: SurveySection[];
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  isNextDisabled?: boolean;
  isLoading?: boolean;
  showNavigation?: boolean;
}

const SurveyLayout = ({
  children,
  currentSection,
  completedSections,
  onBack,
  onNext,
  nextLabel = 'Next Section',
  backLabel = 'Back',
  isNextDisabled = false,
  isLoading = false,
  showNavigation = true,
}: SurveyLayoutProps) => {
  const router = useRouter();
  const currentIndex = SURVEY_SECTIONS.findIndex((s) => s.id === currentSection);
  const isFirstSection = currentIndex === 0;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (!isFirstSection) {
      const prevSection = SURVEY_SECTIONS[currentIndex - 1];
      router.push(`/survey/${prevSection.id}`);
    } else {
      router.push('/survey');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with progress */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">F2F</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Friction-to-Flow AI Audit</h1>
                <p className="text-sm text-gray-500">
                  {SURVEY_SECTIONS.find((s) => s.id === currentSection)?.subtitle || 'Survey'}
                </p>
              </div>
            </div>
            <NeoButton
              variant="ghost"
              size="sm"
              onClick={() => router.push('/survey')}
            >
              Save & Exit
            </NeoButton>
          </div>
          <NeoProgress
            currentSection={currentSection}
            completedSections={completedSections}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <NeoCard padding="xl" className="mb-8">
          {children}
        </NeoCard>

        {/* Navigation buttons */}
        {showNavigation && (
          <div className="flex justify-between items-center">
            <NeoButton
              variant="ghost"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {backLabel}
            </NeoButton>

            <NeoButton
              variant="primary"
              onClick={onNext}
              disabled={isNextDisabled}
              loading={isLoading}
              className="flex items-center gap-2"
            >
              {nextLabel}
              {!isLoading && (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </NeoButton>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-500">
          Your responses are saved automatically and kept confidential.
        </p>
      </footer>
    </div>
  );
};

export { SurveyLayout };
