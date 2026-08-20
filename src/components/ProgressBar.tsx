import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  color: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, color }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="progress-bar-track">
      <div
        className="progress-bar-fill"
        style={{
          width: `${percentage}%`,
          background: color,
        }}
      />
    </div>
  );
};
