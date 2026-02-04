'use client';

import { ARCHETYPES } from '@/lib/constants';
import { ArchetypeId } from '@/types';
import { BRAND_GRADIENT, BRAND_COLORS } from '@/lib/colors';

interface ArchetypeBadgeProps {
  archetypeId: ArchetypeId;
  showDescription?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: {
    badge: 'text-xs px-2 py-1',
    title: 'text-lg',
    description: 'text-sm',
  },
  md: {
    badge: 'text-xs px-3 py-1.5',
    title: 'text-xl',
    description: 'text-base',
  },
  lg: {
    badge: 'text-sm px-4 py-2',
    title: 'text-2xl',
    description: 'text-lg',
  },
};

export function ArchetypeBadge({
  archetypeId,
  showDescription = true,
  size = 'md'
}: ArchetypeBadgeProps) {
  const archetype = ARCHETYPES[archetypeId];

  if (!archetype) return null;

  return (
    <div className="flex flex-col">
      <span
        className={`
          inline-block ${sizeClasses[size].badge} rounded-full font-semibold uppercase tracking-wider mb-2
        `}
        style={{
          background: BRAND_GRADIENT,
          color: 'white'
        }}
      >
        Your Archetype
      </span>
      <h2
        className={`${sizeClasses[size].title} font-bold text-gray-900 mb-1`}
      >
        {archetype.name}
      </h2>
      {showDescription && (
        <p className={`${sizeClasses[size].description} text-gray-600 italic`}>
          "{archetype.philosophy}"
        </p>
      )}
    </div>
  );
}

interface ArchetypeAvatarProps {
  archetypeId: ArchetypeId;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const avatarSizes = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-28 h-28',
  xl: 'w-40 h-40',
};

export function ArchetypeAvatar({ archetypeId, size = 'md' }: ArchetypeAvatarProps) {
  const archetype = ARCHETYPES[archetypeId];

  if (!archetype) return null;

  // Generate a simple avatar based on archetype
  const getAvatarIcon = () => {
    switch (archetypeId) {
      case 'efficiency-specialist':
        return (
          <svg className="w-1/2 h-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'workflow-architect':
        return (
          <svg className="w-1/2 h-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        );
      case 'craft-guardian':
        return (
          <svg className="w-1/2 h-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'curious-explorer':
        return (
          <svg className="w-1/2 h-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'steady-guide':
        return (
          <svg className="w-1/2 h-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'strategic-navigator':
        return (
          <svg className="w-1/2 h-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`${avatarSizes[size]} flex items-center justify-center`}
    >
      <span style={{ color: archetype.color }}>
        {getAvatarIcon()}
      </span>
    </div>
  );
}
