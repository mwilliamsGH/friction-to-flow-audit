'use client';

import { NeoCard } from '@/components/ui';

interface EvolutionaryStrategyProps {
  narrative: string;
  coreRecommendation: string;
  onExploreToolkit?: () => void;
}

export function EvolutionaryStrategy({
  narrative,
  coreRecommendation,
  onExploreToolkit
}: EvolutionaryStrategyProps) {
  return (
    <NeoCard className="w-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Evolutionary Strategy</h3>
      </div>

      <div className="space-y-4">
        {/* Narrative */}
        <p className="text-gray-700 leading-relaxed">
          {narrative}
        </p>

        {/* Core Recommendation */}
        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            Core Recommendation
          </p>
          <p className="text-gray-800 font-medium italic">
            "{coreRecommendation}"
          </p>
        </div>

        {/* CTA */}
        {onExploreToolkit && (
          <button
            onClick={onExploreToolkit}
            className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-hover transition-colors"
          >
            Explore Your Recommended Toolkit
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        )}
      </div>
    </NeoCard>
  );
}
