'use client';

import { NeoCard } from '@/components/ui/neo-card';
import { NeoButton } from '@/components/ui/neo-button';
import { SectionConfig } from '@/types';

interface SectionIntroProps {
  section: SectionConfig;
  questionCount: number;
  onStart: () => void;
  isFirstSection?: boolean;
}

const SectionIntro = ({
  section,
  questionCount,
  onStart,
  isFirstSection = false,
}: SectionIntroProps) => {
  // Icons for each section
  const getSectionIcon = (sectionId: string) => {
    switch (sectionId) {
      case 'foundation':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'friction':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'ai-sentiment':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'magic-button':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Background gradient colors for each section
  const getSectionGradient = (sectionId: string) => {
    switch (sectionId) {
      case 'foundation':
        return 'from-blue-50 to-indigo-50';
      case 'friction':
        return 'from-orange-50 to-amber-50';
      case 'ai-sentiment':
        return 'from-purple-50 to-violet-50';
      case 'magic-button':
        return 'from-emerald-50 to-teal-50';
      default:
        return 'from-gray-50 to-slate-50';
    }
  };

  // Icon background colors
  const getIconBgColor = (sectionId: string) => {
    switch (sectionId) {
      case 'foundation':
        return 'bg-blue-100 text-blue-600';
      case 'friction':
        return 'bg-orange-100 text-orange-600';
      case 'ai-sentiment':
        return 'bg-purple-100 text-purple-600';
      case 'magic-button':
        return 'bg-emerald-100 text-emerald-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <NeoCard
      padding="none"
      className={`relative overflow-hidden bg-gradient-to-br ${getSectionGradient(section.id)}`}
    >
      <div className="p-8 md:p-12">
        {/* Section badge */}
        <div className="inline-flex items-center gap-2 mb-6">
          <span className="px-3 py-1 bg-white/80 backdrop-blur rounded-full text-sm font-medium text-gray-700 shadow-sm">
            {section.title}
          </span>
          <span className="px-3 py-1 bg-white/60 backdrop-blur rounded-full text-sm text-gray-600">
            {questionCount} questions
          </span>
        </div>

        {/* Icon and title */}
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-4 rounded-2xl ${getIconBgColor(section.id)}`}>
            {getSectionIcon(section.id)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {section.introTitle}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {section.introDescription}
            </p>
          </div>
        </div>

        {/* Additional context for first section */}
        {isFirstSection && (
          <div className="mt-6 p-4 bg-white/60 backdrop-blur rounded-xl border border-white/40">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  What to expect
                </p>
                <p className="text-sm text-gray-600">
                  This audit takes about 10-15 minutes to complete. Your answers help us understand your unique workflow and identify opportunities for AI-powered improvements.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Start button */}
        <div className="mt-8">
          <NeoButton
            variant="primary"
            size="lg"
            onClick={onStart}
            className="w-full sm:w-auto"
          >
            {isFirstSection ? 'Start Section' : 'Continue'}
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </NeoButton>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-10 transform translate-x-16 -translate-y-16">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-primary-light" />
      </div>
    </NeoCard>
  );
};

export { SectionIntro };
