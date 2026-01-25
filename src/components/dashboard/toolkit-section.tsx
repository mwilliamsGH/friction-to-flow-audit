'use client';

import { NeoCard, NeoButton } from '@/components/ui';
import { ToolCard as ToolCardType } from '@/types/database';
import { TOOLS } from '@/lib/constants';

interface ToolCardProps {
  tool: ToolCardType;
  tutorialUrl?: string | null;
}

function ToolCard({ tool, tutorialUrl }: ToolCardProps) {
  const toolConfig = TOOLS.find((t) => t.name === tool.tool);

  const getToolIcon = () => {
    switch (tool.tool) {
      case 'NotebookLM':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'Claude / Gemini / ChatGPT / Perplexity':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'AI Studio':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      case 'Claude Cowork':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'Custom Agents':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  return (
    <NeoCard className="h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-lg font-bold text-gray-900">{tool.tool}</h4>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">
            {tool.subtitle}
          </p>
        </div>
        {tutorialUrl && (
          <a
            href={tutorialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </a>
        )}
      </div>

      <ul className="space-y-2 mb-4 flex-grow">
        {tool.use_cases.map((useCase, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <span className="text-sm text-gray-600">{useCase}</span>
          </li>
        ))}
      </ul>

      {tool.why_this_matters && (
        <p className="text-xs text-gray-500 italic border-t border-gray-100 pt-3">
          {tool.why_this_matters}
        </p>
      )}

      <NeoButton
        variant="ghost"
        size="sm"
        fullWidth
        className="mt-4"
        onClick={() => tutorialUrl && window.open(tutorialUrl, '_blank')}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        Launch Project Plan
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Curated Toolkit</h3>
            <p className="text-sm text-gray-500">Your personalized AI recommendations</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
          Tailored Selection ({toolkit.length}/5)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
