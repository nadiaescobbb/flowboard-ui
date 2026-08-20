import React, { useState } from 'react';
import { Btn } from './Btn';

interface AnomalyBannerProps {
  onViewAffected?: () => void;
}

export const AnomalyBanner: React.FC<AnomalyBannerProps> = ({ onViewAffected }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="anomaly-banner" role="alert">
      <span className="anomaly-icon" aria-hidden="true">⚠</span>
      <div className="anomaly-text">
        <span className="anomaly-title">Retention Alert: </span>
        <span className="anomaly-desc">
          14 accounts ($4,200 MRR) at risk of churn due to failed payment retries.
        </span>
      </div>
      <div className="anomaly-actions">
        <Btn variant="primary" onClick={onViewAffected} style={{ fontSize: 11, padding: '4px 10px' }}>
          View Affected Accounts
        </Btn>
        <Btn
          variant="ghost"
          onClick={() => setDismissed(true)}
          style={{ fontSize: 11, color: 'var(--text-tertiary)' }}
        >
          Dismiss
        </Btn>
      </div>
    </div>
  );
};
