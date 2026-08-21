import React from 'react';
import { ChannelShare } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ChannelBreakdownProps {
  channels: ChannelShare[];
}

export const ChannelBreakdown: React.FC<ChannelBreakdownProps> = ({ channels }) => {
  const maxVal = Math.max(...channels.map((c) => c.value)) || 1;

  return (
    <div className="channel-card">
      <div className="channel-header">
        <div className="channel-title">Acquisition Channel Breakdown</div>
        <div className="channel-sub">Conversion volume & share · Last 30 days</div>
      </div>

      {/* Ranked Horizontal Progress Bars */}
      <div className="channel-ranked-list">
        {channels.map((c) => {
          const fillWidth = (c.value / maxVal) * 100;
          return (
            <div key={c.name} className="channel-ranked-item">
              <div className="channel-ranked-meta">
                <span className="channel-ranked-name">{c.name}</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className="channel-ranked-val">{formatCurrency(c.value)}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--text-secondary)',
                      width: 34,
                      textAlign: 'right',
                    }}
                  >
                    {c.pct}%
                  </span>
                </div>
              </div>
              <div className="channel-bar-track">
                <div
                  className="channel-bar-fill"
                  style={{
                    width: `${fillWidth}%`,
                    background: c.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
