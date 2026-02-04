'use client';

import { useState } from 'react';
import { TimeAllocation } from '@/types';

interface PieChartProps {
  data: TimeAllocation;
  size?: number;
  className?: string;
}

import { BRAND_COLORS } from '@/lib/colors';

// Colors for each category
const CATEGORY_COLORS = {
  creative: BRAND_COLORS.primary,    // Vibrant Teal
  production: BRAND_COLORS.dark,     // Medium-dark Teal
  communication: BRAND_COLORS.medium, // Medium-light
  admin: BRAND_COLORS.light,         // Light Teal
};

export function PieChart({ data, size = 200, className = '' }: PieChartProps) {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  const center = size / 2;
  const radius = (size / 2) - 10;

  const categories = [
    { key: 'creative' as const, label: 'Creative', color: CATEGORY_COLORS.creative },
    { key: 'production' as const, label: 'Production', color: CATEGORY_COLORS.production },
    { key: 'communication' as const, label: 'Communication', color: CATEGORY_COLORS.communication },
    { key: 'admin' as const, label: 'Admin', color: CATEGORY_COLORS.admin },
  ];

  // Calculate total for normalization
  const total = categories.reduce((sum, cat) => sum + (data[cat.key] || 0), 0);

  // Generate pie slices
  let currentAngle = -90; // Start from top

  const slices = categories.map((category) => {
    const value = data[category.key] || 0;
    const percentage = total > 0 ? (value / total) * 100 : 25;
    const angle = (percentage / 100) * 360;

    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    // Calculate path
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    // Path for pie slice
    const path = `
      M ${center} ${center}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `;

    // Calculate label position (middle of the arc, slightly inward)
    const midAngle = startAngle + angle / 2;
    const midRad = (midAngle * Math.PI) / 180;
    const labelRadius = radius * 0.65;
    const labelX = center + labelRadius * Math.cos(midRad);
    const labelY = center + labelRadius * Math.sin(midRad);

    return {
      ...category,
      value,
      percentage: Math.round(percentage),
      path,
      labelX,
      labelY,
    };
  });

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Pie slices */}
        {slices.map((slice) => (
          <path
            key={slice.key}
            d={slice.path}
            fill={slice.color}
            stroke="white"
            strokeWidth="2"
            className="transition-all duration-300 hover:opacity-80 cursor-pointer"
            onMouseEnter={() => setHoveredSlice(slice.label)}
            onMouseLeave={() => setHoveredSlice(null)}
          />
        ))}

        {/* Percentage labels on slices */}
        {slices.map((slice) => (
          slice.percentage > 5 && (
            <text
              key={`label-${slice.key}`}
              x={slice.labelX}
              y={slice.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white font-bold text-sm"
              style={{ fontSize: '12px' }}
            >
              {slice.percentage}%
            </text>
          )
        ))}
      </svg>

      {/* Centered Tooltip/Label */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-300"
        style={{ opacity: hoveredSlice ? 1 : 0 }}
      >
        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-gray-100 text-center">
          <p className="text-sm font-bold text-gray-900 whitespace-nowrap">{hoveredSlice}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {slices.map((slice) => (
          <div key={`legend-${slice.key}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-xs text-gray-600">
              {slice.label} <span className="font-semibold">{slice.value}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Keep RadarChart for backward compatibility but it now renders PieChart
interface RadarChartProps {
  data: TimeAllocation;
  size?: number;
  className?: string;
}

export function RadarChart(props: RadarChartProps) {
  return <PieChart {...props} />;
}

interface SkillSignatureProps {
  data: TimeAllocation;
  title?: string;
  subtitle?: string;
}

export function SkillSignature({ data, title = 'Time Allocation', subtitle = 'How You Spend Your Work Time' }: SkillSignatureProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
        <div>
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <p className="text-xs text-gray-500 uppercase tracking-wider">{subtitle}</p>
        </div>
      </div>
      <PieChart data={data} size={250} />
    </div>
  );
}
