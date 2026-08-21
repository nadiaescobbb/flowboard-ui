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
    <div className="kpi-hierarchy-grid">
      {/* 1. Monthly Recurring Revenue (HERO KPI - 1.2x weight) */}
      <div className="kpi-card kpi-card-hero">
        <div className="kpi-card-header">
          <span className="kpi-label">Monthly Recurring Revenue</span>
          <span className="kpi-trend kpi-trend-pos">↑ +{summary.mrrGrowth}% vs last mo</span>
        </div>
        <div style={{ margin: '4px 0 2px' }}>
          <div className="kpi-value-hero">{formatCurrency(summary.mrr)}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
            ARR run-rate:{' '}
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              {formatCurrency(summary.arrRunRate, true)}
            </span>
          </div>
          <Sparkline data={mrrSparkData} color="var(--positive)" />
        </div>
      </div>

      {/* 2. Net Revenue Retention (HERO KPI - 1.2x weight) */}
      <div className="kpi-card kpi-card-hero">
        <div className="kpi-card-header">
          <span className="kpi-label">Net Revenue Retention</span>
          <span className="kpi-trend kpi-trend-pos">↑ +3.1 pts QoQ</span>
        </div>
        <div style={{ margin: '4px 0 2px' }}>
          <div className="kpi-value-hero">{formatPercentage(summary.nrr)}</div>
          <div className="kpi-subtext">Target: {summary.nrrTarget}%</div>
        </div>
        <div style={{ marginTop: 4 }}>
          <ProgressBar value={summary.nrr} max={120} color="var(--positive)" />
          <div className="nrr-markers">
            <span>0%</span>
            <span>Target 110%</span>
            <span>120%</span>
          </div>
        </div>
      </div>

      {/* 3. Active Subscriptions (SUPPORTING KPI) */}
      <KpiCard
        label="Active Subscriptions"
        value={summary.activeSubscriptions.toLocaleString()}
        subtext={`↑ ${summary.newThisMonth} new this month`}
        trend="↑ +4.5%"
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

      {/* 4. Churn Risk Score (SUPPORTING KPI) */}
      <KpiCard label="Churn Risk Score" value={formatPercentage(summary.churnRiskScore)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <span className="risk-pill">
            <span className="risk-dot" />
            Low Risk
          </span>
          <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
            {summary.flaggedAccountsCount} flagged
          </span>
        </div>
        <div style={{ marginTop: 6 }}>
          <ProgressBar value={summary.churnRiskScore} max={10} color="var(--positive)" />
        </div>
      </KpiCard>
    </div>
  );
};
