import React from 'react';
import { PaymentStatus } from '../types';

interface StatusPillProps {
  status: PaymentStatus | string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const cfg: Record<string, { bg: string; border: string; text: string; dot: string }> = {
    Paid: {
      bg: 'var(--success-surface)',
      border: 'var(--success-border)',
      text: 'var(--success-text)',
      dot: 'var(--positive)',
    },
    Retrying: {
      bg: 'var(--warning-surface)',
      border: 'var(--warning-border)',
      text: 'var(--warning-text)',
      dot: 'var(--warning)',
    },
    Failed: {
      bg: 'var(--danger-surface)',
      border: 'var(--danger-border)',
      text: 'var(--danger-text)',
      dot: 'var(--danger)',
    },
  };
  const c = cfg[status] ?? cfg['Paid'];
  return (
    <span
      className="status-pill"
      style={{
        background: c.bg,
        borderColor: c.border,
        color: c.text,
        borderStyle: 'solid',
        borderWidth: '1px',
      }}
    >
      <span className="status-dot" style={{ background: c.dot }} />
      {status}
    </span>
  );
};
