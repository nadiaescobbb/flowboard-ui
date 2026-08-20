import React from 'react';
import { KpiSummary } from '../types';
import { KpiCard } from './KpiCard';
import { Sparkline } from './Sparkline';
import { ProgressBar } from './ProgressBar';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface KpiGridProps {
  summary: KpiSummary;
}

const mrrSparkData = [112, 118.5, 122.3, 119.8, 128.4, 131.2, 135.6, 140.1, 143.8, 141.2, 146.9, 148.45];

export const KpiGrid: React.FC<KpiGridProps> = ({ summary }) => {
  return (
    <div className="kpi-grid">
      {/* 1. Monthly Recurring Revenue */}
      <KpiCard
        label="Monthly Recurring Revenue"
        value={formatCurrency(summary.mrr)}
        trend={`+${summary.mrrGrowth}% vs last mo`}
        trendPositive
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 4 }}>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
            ARR run-rate:{' '}
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              {formatCurrency(summary.arrRunRate, true)}
            </span>
          </div>
          <Sparkline data={mrrSparkData} color="#D9532F" />
        </div>
      </KpiCard>

      {/* 2. Net Revenue Retention */}
      <KpiCard
        label="Net Revenue Retention"
        value={formatPercentage(summary.nrr)}
        subtext={`Target: ${summary.nrrTarget}% · +3.1 pts QoQ`}
        trendPositive
      >
        <div style={{ marginTop: 6 }}>
          <ProgressBar value={summary.nrr} max={120} color="var(--positive)" />
          <div className="nrr-markers">
            <span>0%</span>
            <span>Target 110%</span>
            <span>120%</span>
          </div>
        </div>
      </KpiCard>

      {/* 3. Active Subscriptions */}
      <KpiCard
        label="Active Subscriptions"
        value={summary.activeSubscriptions.toLocaleString()}
        subtext={`↑ ${summary.newThisMonth} new this month`}
        trend="+4.5%"
        trendPositive
      >
        <div className="subscriptions-breakdown">
          {[
            { label: 'Enterprise', count: summary.planBreakdown.enterprise, color: 'var(--text-primary)' },
            { label: 'Pro', count: summary.planBreakdown.pro, color: 'var(--positive)' },
            { label: 'Free', count: summary.planBreakdown.free, color: 'var(--text-tertiary)' },
          ].map((item) => (
            <div key={item.label} className="sub-breakdown-box">
              <div className="sub-count" style={{ color: item.color }}>
                {item.count.toLocaleString()}
              </div>
              <div className="sub-label">{item.label}</div>
            </div>
          ))}
        </div>
      </KpiCard>

      {/* 4. Churn Risk Score */}
      <KpiCard label="Churn Risk Score" value={formatPercentage(summary.churnRiskScore)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span className="risk-pill">
            <span className="risk-dot" />
            Low Risk
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
            {summary.flaggedAccountsCount} flagged accounts
          </span>
        </div>
        <div style={{ marginTop: 8 }}>
          <ProgressBar value={summary.churnRiskScore} max={10} color="var(--positive)" />
        </div>
      </KpiCard>
    </div>
  );
};
