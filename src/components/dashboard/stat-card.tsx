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
  default: 'text-brand-dark',
  blue: 'text-brand-primary',
  green: 'text-brand-primary',
  orange: 'text-brand-dark',
  purple: 'text-brand-primary',
};

const iconBgClasses = {
  default: '',
  blue: '',
  green: '',
  orange: '',
  purple: '',
};

export function StatCard({ label, value, sublabel, icon, color = 'default' }: StatCardProps) {
  return (
    <NeoCard className="flex flex-col h-full relative overflow-hidden">
      <div className="neo-top-accent"></div>
      {icon && (
        <div className={`w-12 h-12 neo-inset-circle flex items-center justify-center mb-4 ${colorClasses[color]}`}>
          {icon}
        </div>
      )}
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </span>
      <span className={`text-3xl font-bold text-black`}>
        {value}
      </span>
      {sublabel && (
        <span className="text-sm text-gray-400 mt-1">{sublabel}</span>
      )}
    </NeoCard>
  );
}
