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
    <div className="flex flex-col lg:flex-row items-stretch gap-8 mb-8">
      {/* Archetype Profile - ~50% */}
      <div className="flex-1 flex flex-col items-center text-center lg:flex-row lg:text-left lg:items-center gap-6 bg-white/50 lg:bg-transparent p-6 lg:p-0 rounded-3xl lg:rounded-none border border-white lg:border-none shadow-sm lg:shadow-none">
        <div className="flex-shrink-0 relative">
          <div className="absolute inset-0 bg-white/50 rounded-full blur-xl lg:hidden"></div>
          <div className="relative z-10">
            <ArchetypeAvatar archetypeId={archetypeId} size="xl" />
          </div>
        </div>
        <div>
          <ArchetypeBadge archetypeId={archetypeId} showDescription={true} size="sm" />
        </div>
      </div>

      {/* Stats - ~50% */}
      <div className="w-full lg:w-[50%] flex flex-col md:flex-row gap-4">
        <div className="flex-1">
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
        </div>
        <div className="flex-1">
          <StatCard
            label="AI Readiness"
            value={`${aiReadinessScore}%`}
            sublabel="Top 10% Agency"
            color="blue"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
        </div>
        <div className="flex-1">
          <StatCard
            label="Automation Potential"
            value={`${automationPotential}%`}
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
    </div>
  );
}
