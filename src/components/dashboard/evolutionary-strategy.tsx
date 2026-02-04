'use client';


import { NeoCard } from '@/components/ui';
import { BRAND_COLORS, BRAND_GRADIENT } from '@/lib/colors';

interface EvolutionaryStrategyProps {
  narrative: string;
  coreRecommendation: string;
  onExploreToolkit?: () => void;
  children?: React.ReactNode;
}

export function EvolutionaryStrategy({
  narrative,
  coreRecommendation,
  onExploreToolkit,
  children
}: EvolutionaryStrategyProps) {
  return (
    <NeoCard className="w-full p-8 relative overflow-hidden">
      <div
        className="absolute left-0 top-0 bottom-0 w-2"
        style={{ background: BRAND_GRADIENT }}
      />

      <div className={`grid grid-cols-1 ${children ? 'lg:grid-cols-3 gap-12' : 'gap-6'}`}>
        {/* Left Side: Header + Narrative */}
        <div className={children ? 'lg:col-span-2 space-y-6' : 'space-y-6'}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 neo-inset-circle text-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[var(--text-heading)]">Evolutionary Strategy</h3>
          </div>

          <p className="text-gray-700 leading-relaxed text-lg">
            {narrative}
          </p>

          <div className="neo-inset p-6 bg-gray-50/50">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Core Recommendation
            </p>
            <p className="text-gray-900 font-bold italic text-lg leading-relaxed">
              "{coreRecommendation}"
            </p>
          </div>

          {onExploreToolkit && (
            <button
              onClick={onExploreToolkit}
              className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-hover transition-colors"
            >
              Explore Your Recommended Toolkit
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          )}
        </div>

        {/* Right Side Content (Chart) - Spans full height */}
        {children && (
          <div className="lg:col-span-1 border-l border-gray-100 flex flex-col justify-center bg-brand-lightest/20 rounded-2xl p-6 h-full">
            {children}
          </div>
        )}
      </div>
    </NeoCard>
  );
}
