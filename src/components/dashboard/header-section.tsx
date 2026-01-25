'use client';

import { ArchetypeBadge, ArchetypeAvatar } from './archetype-badge';
import { StatCard } from './stat-card';
import { ArchetypeId } from '@/types';

interface HeaderSectionProps {
  userName?: string;
  archetypeId: ArchetypeId;
  weeklyFrictionHours: number;
  aiReadinessScore: number;
  automationPotential: number;
}

export function HeaderSection({
  userName,
  archetypeId,
  weeklyFrictionHours,
  aiReadinessScore,
  automationPotential
}: HeaderSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Archetype Profile */}
      <div className="neo-card p-6 flex items-center gap-6">
        <ArchetypeAvatar archetypeId={archetypeId} size="lg" />
        <ArchetypeBadge archetypeId={archetypeId} showDescription={true} size="md" />
      </div>

      {/* Stats */}
      <div className="lg:col-span-2 grid grid-cols-3 gap-4">
        <StatCard
          label="Time Reclaim"
          value={`${weeklyFrictionHours}h`}
          sublabel="Manual 'mud' / wk"
          color="orange"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="AI Readiness"
          value={`${aiReadinessScore}%`}
          sublabel={aiReadinessScore >= 70 ? 'Top 10% Agency' : aiReadinessScore >= 50 ? 'Above Average' : 'Growing'}
          color="blue"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
        <StatCard
          label="Adaptability"
          value={automationPotential >= 75 ? 'Elite' : automationPotential >= 50 ? 'Strong' : 'Building'}
          sublabel="Tech Resilience"
          color="green"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>
    </div>
  );
}
