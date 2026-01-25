'use client';

import { NeoCard } from '@/components/ui';

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: React.ReactNode;
  color?: 'default' | 'blue' | 'green' | 'orange' | 'purple';
}

const colorClasses = {
  default: 'text-gray-600',
  blue: 'text-primary',
  green: 'text-accent-green',
  orange: 'text-accent-orange',
  purple: 'text-accent-purple',
};

const iconBgClasses = {
  default: 'bg-gray-100',
  blue: 'bg-blue-50',
  green: 'bg-green-50',
  orange: 'bg-orange-50',
  purple: 'bg-purple-50',
};

export function StatCard({ label, value, sublabel, icon, color = 'default' }: StatCardProps) {
  return (
    <NeoCard className="flex flex-col">
      {icon && (
        <div className={`w-10 h-10 rounded-xl ${iconBgClasses[color]} flex items-center justify-center mb-3`}>
          <span className={colorClasses[color]}>{icon}</span>
        </div>
      )}
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </span>
      <span className={`text-3xl font-bold ${colorClasses[color]}`}>
        {value}
      </span>
      {sublabel && (
        <span className="text-sm text-gray-400 mt-1">{sublabel}</span>
      )}
    </NeoCard>
  );
}
