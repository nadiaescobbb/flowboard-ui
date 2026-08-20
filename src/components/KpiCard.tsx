import React from 'react';

export interface KpiCardProps {
  label: string;
  value: string;
  subtext?: string;
  trend?: string;
  trendPositive?: boolean;
  children?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subtext,
  trend,
  trendPositive,
  children,
}) => {
  return (
    <div className="kpi-card">
      <div className="kpi-card-header">
        <span className="kpi-label">{label}</span>
        {trend && (
          <span className={`kpi-trend ${trendPositive ? 'kpi-trend-pos' : 'kpi-trend-neg'}`}>
            {trend}
          </span>
        )}
      </div>

      <div className="kpi-card-body">
        <div className="kpi-value">{value}</div>
        {subtext && <div className="kpi-subtext">{subtext}</div>}
      </div>

      {children}
    </div>
  );
};
