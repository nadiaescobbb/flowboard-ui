import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ChannelShare } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ChannelBreakdownProps {
  channels: ChannelShare[];
}

export const ChannelBreakdown: React.FC<ChannelBreakdownProps> = ({ channels }) => {
  return (
    <div className="channel-card">
      <div className="channel-header">
        <div className="channel-title">Acquisition Channel Breakdown</div>
        <div className="channel-sub">Conversion by source · Last 30 days</div>
      </div>

      {/* Donut PieChart */}
      <div className="pie-container">
        <ResponsiveContainer width="100%" height={130}>
          <PieChart>
            <Pie
              data={channels}
              cx="50%"
              cy="50%"
              innerRadius={38}
              outerRadius={56}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {channels.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="chart-tooltip">
                    <div className="tooltip-label">{d.name}</div>
                    <div className="tooltip-value">
                      {formatCurrency(d.value)} · {d.pct}%
                    </div>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* List */}
      <div className="channel-list">
        {channels.map((c) => (
          <div key={c.name} className="channel-item">
            <span className="channel-dot" style={{ background: c.color }} />
            <span className="channel-name">{c.name}</span>
            <span className="channel-val">{formatCurrency(c.value)}</span>
            <span className="channel-pct">{c.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
