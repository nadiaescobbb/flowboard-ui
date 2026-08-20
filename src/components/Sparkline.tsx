import React from 'react';

interface SparklineProps {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({ data, color, width = 64, height = 24 }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 2) - 1}`)
    .join(' ');
  const area = `0,${height} ${points} ${(data.length - 1) * step},${height}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <polygon points={area} fill={color} opacity={0.12} />
      <polyline
        points={points}
        stroke={color}
        strokeWidth={1.5}
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};
