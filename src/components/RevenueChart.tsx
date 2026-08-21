import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyMetric, MetricTab, DateRange } from '../types';
import { formatCurrency } from '../utils/formatters';

interface RevenueChartProps {
  metrics: MonthlyMetric[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  tab: MetricTab;
}

function ChartTooltip({ active, payload, label, tab }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  const fmt = tab === 'Net Churn' ? `${val}%` : formatCurrency(val ?? 0);
  return (
    <div className="chart-tooltip">
      <div className="tooltip-label">{label}</div>
      <div className="tooltip-value">{fmt}</div>
    </div>
  );
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ metrics }) => {
  const [metricTab, setMetricTab] = useState<MetricTab>('MRR');
  const [dateRange, setDateRange] = useState<DateRange>('Last 30 Days');

  const chartKey = metricTab === 'MRR' ? 'mrr' : metricTab === 'ARR' ? 'arr' : 'churn';
  const chartColor = metricTab === 'Net Churn' ? 'var(--danger)' : 'var(--data-series)';

  const yFormatter = (v: number) =>
    metricTab === 'Net Churn'
      ? `${v}%`
      : v >= 1_000_000
      ? `$${(v / 1_000_000).toFixed(1)}M`
      : `$${(v / 1000).toFixed(0)}k`;

  return (
    <div className="revenue-chart-card">
      {/* Header */}
      <div className="chart-card-header">
        <div>
          <div className="chart-card-title">Revenue Trend & Cohort Movement</div>
          <div className="chart-card-sub">12-month trailing performance</div>
        </div>
        <div className="range-btn-group">
          {(['Last 30 Days', 'YTD', 'Custom'] as DateRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`range-btn ${dateRange === r ? 'active' : ''}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="chart-tabs-bar">
        {(['MRR', 'ARR', 'Net Churn'] as MetricTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setMetricTab(tab)}
            className={`metric-tab-btn ${metricTab === tab ? 'active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Recharts AreaChart */}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={metrics} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.15} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: 'var(--text-tertiary)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              tickFormatter={yFormatter}
              tick={{ fill: 'var(--text-tertiary)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              axisLine={false}
              tickLine={false}
              width={52}
            />
            <Tooltip content={<ChartTooltip tab={metricTab} />} />
            <Area
              type="monotone"
              dataKey={chartKey}
              stroke={chartColor}
              strokeWidth={2}
              fill="url(#revenueGrad)"
              dot={false}
              activeDot={{ r: 4, fill: chartColor, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
