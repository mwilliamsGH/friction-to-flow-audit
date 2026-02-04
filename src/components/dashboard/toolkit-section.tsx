'use client';

import { NeoCard, NeoButton } from '@/components/ui';
import { ToolCard as ToolCardType } from '@/types/database';
import { TOOLS } from '@/lib/constants';

interface ToolCardProps {
  tool: ToolCardType;
  tutorialUrl?: string | null;
}

function ToolCard({ tool, tutorialUrl }: ToolCardProps) {
  const toolConfig = TOOLS.find((t) =>
    t.name === tool.tool ||
    tool.tool.includes(t.name) ||
    t.name.includes(tool.tool)
  ) as { name: string; category: string; icon: string; description?: string } | undefined;

  // Icon mapping based on tool config icon names
  const iconMap: Record<string, React.ReactNode> = {
    'book-open': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    'message-circle': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    'code': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    'monitor': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    'bot': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    'default': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  };

  return (
    <NeoCard className="h-full flex flex-col p-8 border-l-[6px] border-[var(--brand-primary)] relative overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className="neo-top-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3 mb-2">
            <div className="text-[var(--brand-primary)] flex-shrink-0 mt-1">
              {toolConfig?.icon && iconMap[toolConfig.icon] ? iconMap[toolConfig.icon] : iconMap['default']}
            </div>
            <h4 className="text-2xl font-display font-black text-[var(--text-heading)] tracking-tight leading-none flex-1 break-words">{toolConfig?.name || tool.tool}</h4>
          </div>
          <span className="inline-block bg-[var(--brand-lightest)] text-grey-500 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase mb-3 border border-[var(--brand-light)]">
            {toolConfig?.category}
          </span>
          {toolConfig?.description && (
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {toolConfig.description}
            </p>
          )}
        </div>
        {tutorialUrl && (
          <a
            href={tutorialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center hover:bg-[var(--brand-lightest)] text-slate-400 hover:text-[var(--brand-primary)] transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>

      {/* Use Cases with Checkmarks */}
      <ul className="space-y-3 mb-6 flex-grow">
        {tool.use_cases.map((useCase, index) => (
          <li key={index} className="flex items-start gap-3 group/item">
            <div className="w-5 h-5 rounded-full bg-[var(--brand-lightest)] flex items-center justify-center flex-shrink-0 mt-0.5 text-[var(--brand-primary)] group-hover/item:bg-[var(--brand-primary)] group-hover/item:text-white transition-colors duration-200">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm text-slate-600 font-medium leading-snug">{useCase}</span>
          </li>
        ))}
      </ul>

      {/* Why It Matters */}
      {tool.why_this_matters && (
        <div className="bg-[var(--brand-lightest)]/30 p-5 rounded-2xl mt-auto border border-[var(--brand-light)]/40 relative">
          <p className="text-xs text-grey-500 italic font-semibold leading-relaxed relative z-10 pl-2">
            "{tool.why_this_matters}"
          </p>
        </div>
      )}

      {/* Action Button */}
      <NeoButton
        variant="ghost"
        size="sm"
        fullWidth
        className="mt-6 text-[var(--brand-dark)] hover:text-[var(--brand-primary)] hover:bg-[var(--brand-lightest)]/50"
        onClick={() => tutorialUrl && window.open(tutorialUrl, '_blank')}
      >
        <span className="font-bold">Launch Project Plan</span>
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </NeoButton>
    </NeoCard>
  );
}

interface ToolkitSectionProps {
  toolkit: ToolCardType[];
  tutorialUrls?: Record<string, string | null>;
}

export function ToolkitSection({ toolkit, tutorialUrls = {} }: ToolkitSectionProps) {
  return (
    <section id="toolkit" className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 neo-inset-circle text-[var(--accent-soft)]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-3xl font-display font-extrabold text-[var(--text-heading)] leading-tight">Curated Toolkit</h3>
            <p className="text-sm font-medium text-slate-500">Your personalized AI recommendations</p>
          </div>
        </div>
        <div className="neo-inset-circle px-5 py-5">
          <p className="text-[10px] font-black text-[var(--accent-soft)] tracking-[0.2em] uppercase">Tailored Selection ({toolkit.length}/5)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {toolkit.map((tool) => (
          <ToolCard
            key={tool.tool}
            tool={tool}
            tutorialUrl={tutorialUrls[tool.tool]}
          />
        ))}
      </div>
    </section>
  );
}
