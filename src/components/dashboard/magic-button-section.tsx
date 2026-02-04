'use client';

import { NeoCard } from '@/components/ui';
import { Automation } from '@/types/database';
import { COMPLEXITY_COLORS } from '@/lib/constants';
import { BRAND_GRADIENT } from '@/lib/colors';

interface AutomationCardProps {
  automation: Automation;
}

function AutomationCard({ automation }: AutomationCardProps) {
  const colors = COMPLEXITY_COLORS[automation.complexity];

  return (
    <NeoCard className="h-full flex flex-col p-8 group relative overflow-hidden">
      <div className="neo-top-accent"></div>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md relative overflow-hidden"
            style={{ background: BRAND_GRADIENT }}
          >
            {automation.complexity === 'Quick Win' && (
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
            {automation.complexity === 'Project' && (
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            )}
            {automation.complexity === 'Initiative' && (
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{automation.title}</h4>
            <span className={`text-xs font-medium uppercase tracking-wider ${colors.text}`}>
              {automation.complexity}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 flex-grow">
        {automation.description}
      </p>

      {/* Progress bar placeholder */}
      <div className="mb-4">
        <div className={`h-1.5 ${colors.bg} rounded-full overflow-hidden`}>
          <div
            className={`h-full ${automation.complexity === 'Quick Win'
              ? 'bg-brand-primary'
              : automation.complexity === 'Project'
                ? 'bg-brand-medium'
                : 'bg-brand-dark'
              } rounded-full`}
            style={{
              width:
                automation.complexity === 'Quick Win'
                  ? '75%'
                  : automation.complexity === 'Project'
                    ? '50%'
                    : '25%',
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {automation.tools.map((tool) => (
          <span
            key={tool}
            className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
          >
            {tool}
          </span>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        Addresses: <span className="font-medium">{automation.friction_addressed}</span>
      </p>
    </NeoCard>
  );
}

interface MagicButtonSectionProps {
  automations: Automation[];
  frictionContext?: string;
}

export function MagicButtonSection({ automations, frictionContext }: MagicButtonSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 neo-inset-circle text-brand-medium">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div>
          <h3 className="text-3xl font-display font-extrabold text-[var(--text-heading)] leading-tight">The "Magic Button"</h3>
          <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[var(--accent-soft)]/80 mt-1">Automation Opportunities</p>
        </div>
      </div>

      {frictionContext && (
        <NeoCard variant="small" className="bg-brand-lightest/50">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Why These Recommendations?
          </p>
          <p className="text-sm text-gray-700">{frictionContext}</p>
        </NeoCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {automations.map((automation) => (
          <AutomationCard key={automation.rank} automation={automation} />
        ))}
      </div>
    </section>
  );
}
