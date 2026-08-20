import React from 'react';
import { PaymentStatus } from '../types';

interface StatusPillProps {
  status: PaymentStatus | string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const cfg: Record<string, { bg: string; text: string; dot: string }> = {
    Paid: { bg: 'var(--positive-bg)', text: 'var(--positive)', dot: 'var(--positive)' },
    Retrying: { bg: 'var(--warning-bg)', text: 'var(--warning)', dot: 'var(--warning)' },
    Failed: { bg: 'var(--danger-bg)', text: 'var(--danger)', dot: 'var(--danger)' },
  };
  const c = cfg[status] ?? cfg['Paid'];
  return (
    <span className="status-pill" style={{ background: c.bg, color: c.text }}>
      <span className="status-dot" style={{ background: c.dot }} />
      {status}
    </span>
  );
};
