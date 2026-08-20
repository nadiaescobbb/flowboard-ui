import React from 'react';
import { useSimulation } from '../contexts/SimulationContext';

export const DevToolsInspector: React.FC = () => {
  const {
    simState,
    toggleSlowNetwork,
    toggleError500,
    toggleEmptyState,
    isInspectorOpen,
    setIsInspectorOpen,
  } = useSimulation();

  return (
    <div className="inspector-panel">
      {/* Header */}
      <div className="inspector-header" onClick={() => setIsInspectorOpen((o) => !o)}>
        <div className="inspector-title-group">
          <span className="inspector-icon">⬡</span>
          <span className="inspector-title">Portfolio Inspector</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="inspector-badge">Repo Pattern + Query v5</span>
          <span className="inspector-chevron">{isInspectorOpen ? '▾' : '▴'}</span>
        </div>
      </div>

      {/* Body */}
      {isInspectorOpen && (
        <div className="inspector-body">
          <div className="inspector-section-label">Mock API State Controls</div>

          {/* Toggle Slow Network */}
          <div
            className={`inspector-toggle-row ${simState.slowNetwork ? 'active' : ''}`}
            onClick={toggleSlowNetwork}
          >
            <span className="toggle-label">Simulate Slow Network (2000ms)</span>
            <div className={`switch-track ${simState.slowNetwork ? 'on' : ''}`}>
              <div className="switch-thumb" />
            </div>
          </div>

          {/* Toggle 500 Error */}
          <div
            className={`inspector-toggle-row ${simState.error500 ? 'active' : ''}`}
            onClick={toggleError500}
          >
            <span className="toggle-label">Trigger 500 Server Error</span>
            <div className={`switch-track ${simState.error500 ? 'on' : ''}`}>
              <div className="switch-thumb" />
            </div>
          </div>

          {/* Toggle Empty State */}
          <div
            className={`inspector-toggle-row ${simState.emptyState ? 'active' : ''}`}
            onClick={toggleEmptyState}
          >
            <span className="toggle-label">Simulate Empty State</span>
            <div className={`switch-track ${simState.emptyState ? 'on' : ''}`}>
              <div className="switch-thumb" />
            </div>
          </div>

          {/* Diagnostics Box */}
          <div className="inspector-meta-box">
            <div>
              <span className="meta-green">◆ Architecture:</span>{' '}
              <span className="meta-text">Domain Layer Isolation</span>
            </div>
            <div>
              <span className="meta-green">◆ Error Handling:</span>{' '}
              <span className="meta-text">Result Monad (Ok / Err)</span>
            </div>
            <div>
              <span className="meta-orange">◆ Boundary Check:</span>{' '}
              <span className="meta-text">Zod Runtime Validation</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
