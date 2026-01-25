'use client';

import { NeoCard } from '@/components/ui';
import { SurveyResponses } from '@/types';

interface FrictionItem {
  label: string;
  hours: number;
}

interface HighestFrictionCardProps {
  frictionItems: FrictionItem[];
  totalHours: number;
}

export function HighestFrictionCard({ frictionItems, totalHours }: HighestFrictionCardProps) {
  const maxHours = Math.max(...frictionItems.map(item => item.hours));

  return (
    <NeoCard>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
          <svg className="w-4 h-4 text-accent-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h4 className="font-semibold text-gray-900">Highest Friction</h4>
      </div>

      <div className="space-y-3 mb-4">
        {frictionItems.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className="text-sm font-medium text-gray-600">{item.hours}h</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(item.hours / maxHours) * 100}%`,
                  backgroundColor: index === 0 ? '#ef4444' : index === 1 ? '#f97316' : '#22c55e',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500 uppercase tracking-wider">Total Lost Weekly</span>
        <p className="text-2xl font-bold text-accent-red">{totalHours} hrs</p>
      </div>
    </NeoCard>
  );
}

interface CoreTechStackCardProps {
  tools: string[];
  techWalls: string[];
}

export function CoreTechStackCard({ tools, techWalls }: CoreTechStackCardProps) {
  // Map tool values to display labels
  const toolLabels: Record<string, string> = {
    'adobe-photoshop': 'Adobe Photoshop',
    'adobe-illustrator': 'Adobe Illustrator',
    'adobe-indesign': 'Adobe InDesign',
    'adobe-after-effects': 'Adobe After Effects',
    'adobe-premiere-pro': 'Adobe Premiere Pro',
    'figma': 'Figma',
    'canva': 'Canva',
    'microsoft-powerpoint': 'Microsoft PowerPoint',
    'microsoft-excel': 'Microsoft Excel',
    'google-slides': 'Google Slides',
    'google-sheets': 'Google Sheets',
    'slack': 'Slack',
    'microsoft-teams': 'Microsoft Teams',
    'asana': 'Asana',
    'monday': 'Monday.com',
    'frame-io': 'Frame.io',
    'dropbox': 'Dropbox',
    'google-drive': 'Google Drive',
    'box': 'Box',
  };

  return (
    <NeoCard>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
          <svg className="w-4 h-4 text-accent-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h4 className="font-semibold text-gray-900">Core Tech Stack</h4>
      </div>

      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Primary Tools</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tools.slice(0, 6).map((tool) => (
          <span
            key={tool}
            className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
          >
            {toolLabels[tool] || tool}
          </span>
        ))}
        {tools.length > 6 && (
          <span className="px-3 py-1 bg-gray-50 rounded-full text-sm text-gray-500">
            +{tools.length - 6} more
          </span>
        )}
      </div>

      {techWalls.length > 0 && (
        <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
          <p className="text-xs font-semibold text-accent-orange uppercase tracking-wider mb-1">
            Tech Wall Identified
          </p>
          <p className="text-sm text-gray-700 italic">
            "{techWalls[0].replace(/-/g, ' ')}"
          </p>
        </div>
      )}
    </NeoCard>
  );
}

interface AuditSignalsCardProps {
  sacred?: string;
  adoptionSpeed?: string;
  learningStyle?: string;
  magicButton?: string;
}

export function AuditSignalsCard({
  sacred,
  adoptionSpeed,
  learningStyle,
  magicButton
}: AuditSignalsCardProps) {
  const adoptionLabels: Record<string, string> = {
    'pioneer': 'Pioneer',
    'fast-follower': 'Fast Follower',
    'pragmatist': 'Pragmatist',
    'skeptic': 'Skeptic',
  };

  const learningLabels: Record<string, string> = {
    'youtube-tutorials': 'Video Tutorials',
    'documentation': 'Documentation',
    'ask-colleague': 'Peer Learning',
    'trial-error': 'Hands-on Explorer',
    'structured-course': 'Structured Courses',
  };

  const magicLabels: Record<string, string> = {
    'speed': 'Speed',
    'quality': 'Quality',
    'organization': 'Organization',
    'clarity': 'Clarity',
  };

  return (
    <NeoCard>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h4 className="font-semibold text-gray-900">Audit Signals</h4>
      </div>

      {sacred && (
        <div className="mb-4">
          <p className="text-sm text-gray-700 italic leading-relaxed">
            "{sacred}"
          </p>
        </div>
      )}

      <div className="space-y-3">
        {adoptionSpeed && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">AI Sentiment</span>
            <span className="text-sm font-medium text-primary">
              {adoptionLabels[adoptionSpeed] || adoptionSpeed}
            </span>
          </div>
        )}
        {learningStyle && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Learning Style</span>
            <span className="text-sm font-medium text-primary">
              {learningLabels[learningStyle] || learningStyle}
            </span>
          </div>
        )}
        {magicButton && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Success Metric</span>
            <span className="text-sm font-medium text-primary">
              {magicLabels[magicButton] || magicButton}
            </span>
          </div>
        )}
      </div>
    </NeoCard>
  );
}

interface EvidenceLayerProps {
  responses: SurveyResponses;
}

export function EvidenceLayer({ responses }: EvidenceLayerProps) {
  // Map friction types to readable labels
  const frictionLabels: Record<string, string> = {
    'the-pivot': 'Last-Minute Pivots',
    'the-asset-hunt': 'Asset Hunting',
    'the-versioning-loop': 'Version Control',
    'the-seasonal-rollout': 'Seasonal Rollouts',
    'the-approval-chase': 'Approval Chasing',
    'the-format-shuffle': 'Format Conversion',
    'the-handoff-gap': 'Handoff Gaps',
  };

  // Create friction items from responses
  const totalHours = responses.q15_total_friction_hours || 0;
  const worstHours = responses.q14_worst_friction_hours || 0;
  const frictionTypes = responses.q13_friction_types || [];

  // Distribute hours across friction types (weighted by worst friction)
  const frictionItems: FrictionItem[] = frictionTypes.slice(0, 3).map((type, index) => ({
    label: frictionLabels[type] || type.replace(/-/g, ' '),
    hours: index === 0 ? worstHours : Math.round((totalHours - worstHours) / (frictionTypes.length - 1) * 10) / 10,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <HighestFrictionCard
        frictionItems={frictionItems}
        totalHours={totalHours}
      />
      <CoreTechStackCard
        tools={responses.q5_tools || []}
        techWalls={responses.q6_tech_walls || []}
      />
      <AuditSignalsCard
        sacred={responses.q30_sacred}
        adoptionSpeed={responses.q27_adoption_speed}
        learningStyle={responses.q32_learning_style}
        magicButton={responses.q33_magic_button}
      />
    </div>
  );
}
