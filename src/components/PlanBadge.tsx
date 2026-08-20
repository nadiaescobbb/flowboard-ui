import React from 'react';
import { PlanTier } from '../types';

interface PlanBadgeProps {
  plan: PlanTier | string;
}

export const PlanBadge: React.FC<PlanBadgeProps> = ({ plan }) => {
  const cfg: Record<string, { bg: string; text: string }> = {
    Enterprise: { bg: 'var(--bg-tertiary)', text: 'var(--text-primary)' },
    Pro: { bg: 'var(--positive-bg)', text: 'var(--positive)' },
    Free: { bg: 'var(--bg-secondary)', text: 'var(--text-tertiary)' },
  };
  const c = cfg[plan] ?? cfg['Free'];
  return (
    <span className="plan-badge" style={{ background: c.bg, color: c.text }}>
      {plan}
    </span>
  );
};
