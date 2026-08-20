import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useSimulation } from '../contexts/SimulationContext';
import { SimMode } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange }) => {
  const { isDark, toggleTheme } = useTheme();
  const { simState, setMode } = useSimulation();

  return (
    <header className="header-container">
      {/* Brand & Organization */}
      <div className="header-brand">
        <div className="logo-group">
          <span className="logo-text">
            Flow<span className="logo-accent">Board</span>
          </span>
          <span className="live-dot" title="Mock API Connected" />
        </div>
        <div className="divider-v" />
        <select className="org-select" aria-label="Organization Selector">
          <option>Acme Corp — Main Org</option>
          <option>Acme Corp — EU Region</option>
        </select>
      </div>

      {/* Global Search */}
      <div className="header-search-wrap">
        <div className="header-search-box">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="var(--text-tertiary)" strokeWidth="1.5" />
            <path d="M11 11l3 3" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search users, transactions, or metrics..."
            aria-label="Filter users by name, email, plan, or status"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          <kbd className="kbd-badge">⌘K</kbd>
        </div>
      </div>

      {/* Controls */}
      <div className="header-controls">
        {/* Sim Mode Switcher */}
        <div className="sim-mode-group">
          {(['live', 'error500', 'latency'] as SimMode[]).map((mode) => {
            const labels: Record<SimMode, string> = {
              live: '● Live Data',
              error500: 'Simulate 500',
              latency: 'Sim Latency',
            };
            const active = simState.mode === mode;
            return (
              <button
                key={mode}
                onClick={() => setMode(mode)}
                className={`sim-mode-btn ${active ? `sim-mode-${mode}` : ''}`}
              >
                {labels[mode]}
              </button>
            );
          })}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? '☀' : '◑'}
        </button>

        {/* User Profile Avatar */}
        <div className="avatar-pill" title="Logged in as Junior Architect">
          JA
        </div>
      </div>
    </header>
  );
};
