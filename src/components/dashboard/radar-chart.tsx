'use client';

import { TimeAllocation } from '@/types';

interface RadarChartProps {
  data: TimeAllocation;
  size?: number;
  className?: string;
}

export function RadarChart({ data, size = 200, className = '' }: RadarChartProps) {
  const center = size / 2;
  const radius = (size / 2) - 30;

  const labels = [
    { key: 'creative', label: 'Creative', angle: -90 },
    { key: 'production', label: 'Production', angle: 0 },
    { key: 'admin', label: 'Admin', angle: 90 },
    { key: 'communication', label: 'Communication', angle: 180 },
  ] as const;

  // Calculate points for the data polygon
  const getPoint = (value: number, angleDegrees: number) => {
    const normalizedValue = Math.min(value / 100, 1);
    const angleRadians = (angleDegrees * Math.PI) / 180;
    const x = center + radius * normalizedValue * Math.cos(angleRadians);
    const y = center + radius * normalizedValue * Math.sin(angleRadians);
    return { x, y };
  };

  // Create the data polygon points
  const dataPoints = labels.map(({ key, angle }) => {
    const value = data[key];
    return getPoint(value, angle);
  });

  const dataPath = dataPoints
    .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ') + ' Z';

  // Create grid circles
  const gridLevels = [25, 50, 75, 100];

  // Create axis lines
  const axisLines = labels.map(({ angle }) => {
    const end = getPoint(100, angle);
    return { start: { x: center, y: center }, end };
  });

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background grid circles */}
        {gridLevels.map((level) => (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={(radius * level) / 100}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((line, i) => (
          <line
            key={i}
            x1={line.start.x}
            y1={line.start.y}
            x2={line.end.x}
            y2={line.end.y}
            stroke="#d1d5db"
            strokeWidth="1"
          />
        ))}

        {/* Data polygon - filled area */}
        <path
          d={dataPath}
          fill="rgba(59, 130, 246, 0.2)"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Data points */}
        {dataPoints.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="#3b82f6"
            stroke="white"
            strokeWidth="2"
          />
        ))}
      </svg>

      {/* Labels */}
      {labels.map(({ key, label, angle }) => {
        const labelRadius = radius + 20;
        const angleRadians = (angle * Math.PI) / 180;
        const x = center + labelRadius * Math.cos(angleRadians);
        const y = center + labelRadius * Math.sin(angleRadians);

        let textAnchor: 'start' | 'middle' | 'end' = 'middle';
        if (angle === 0) textAnchor = 'start';
        if (angle === 180) textAnchor = 'end';

        return (
          <div
            key={key}
            className="absolute text-xs font-medium text-gray-600"
            style={{
              left: x,
              top: y,
              transform: `translate(-50%, -50%)`,
              textAlign: textAnchor === 'start' ? 'left' : textAnchor === 'end' ? 'right' : 'center',
            }}
          >
            <span className="block">{label}</span>
            <span className="text-primary font-semibold">{data[key]}%</span>
          </div>
        );
      })}
    </div>
  );
}

interface SkillSignatureProps {
  data: TimeAllocation;
  title?: string;
  subtitle?: string;
}

export function SkillSignature({ data, title = 'Skill Signature', subtitle = 'Audit-Derived Mapping' }: SkillSignatureProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <div>
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <p className="text-xs text-gray-500 uppercase tracking-wider">{subtitle}</p>
        </div>
      </div>
      <RadarChart data={data} size={220} />
    </div>
  );
}
