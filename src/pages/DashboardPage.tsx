import React, { useState } from 'react';
import { Header } from '../components/Header';
import { AnomalyBanner } from '../components/AnomalyBanner';
import { KpiGrid } from '../components/KpiGrid';
import { RevenueChart } from '../components/RevenueChart';
import { ChannelBreakdown } from '../components/ChannelBreakdown';
import { CustomerTable } from '../components/CustomerTable';
import { DevToolsInspector } from '../components/DevToolsInspector';
import { Btn } from '../components/Btn';

import {
  useKpiSummary,
  useMonthlyMetrics,
  useChannelShares,
  useCustomers,
} from '../hooks/useDashboardData';

export const DashboardPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const kpiQuery = useKpiSummary();
  const metricsQuery = useMonthlyMetrics();
  const channelsQuery = useChannelShares();
  const customersQuery = useCustomers();

  const isError =
    kpiQuery.isError ||
    metricsQuery.isError ||
    channelsQuery.isError ||
    customersQuery.isError;

  const isLoading =
    kpiQuery.isLoading ||
    metricsQuery.isLoading ||
    channelsQuery.isLoading ||
    customersQuery.isLoading;

  const handleRetryAll = () => {
    kpiQuery.refetch();
    metricsQuery.refetch();
    channelsQuery.refetch();
    customersQuery.refetch();
  };

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Main Container */}
      <main className="dashboard-main">
        {/* Retention Alert Banner */}
        <AnomalyBanner
          onViewAffected={() => {
            setSearchQuery('Past Due');
          }}
        />

        {/* Section Title */}
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Revenue Operations</h1>
            <p className="page-subtitle">Acme Corp · Updated 2 minutes ago</p>
          </div>
          <div className="page-header-actions">
            <Btn variant="default" style={{ fontSize: 11 }}>
              ↓ Export Report
            </Btn>
            <Btn variant="primary" style={{ fontSize: 11 }}>
              + New Segment
            </Btn>
          </div>
        </div>

        {/* Global Error State (Simulated 500) */}
        {isError ? (
          <div className="error-fallback-card">
            <div className="error-fallback-icon">⚠</div>
            <h3 className="error-fallback-title">500 Internal Server Error</h3>
            <p className="error-fallback-desc">
              Unable to fetch dashboard telemetry metrics from mock repository API.
            </p>
            <Btn variant="primary" onClick={handleRetryAll} style={{ marginTop: 12 }}>
              🔄 Retry Request
            </Btn>
          </div>
        ) : isLoading ? (
          /* Loading Skeleton */
          <div className="loading-skeleton-wrap">
            <div className="skeleton-box" style={{ height: 96 }} />
            <div className="skeleton-box" style={{ height: 320 }} />
            <div className="skeleton-box" style={{ height: 400 }} />
          </div>
        ) : (
          <>
            {/* KPI Grid */}
            {kpiQuery.data && <KpiGrid summary={kpiQuery.data} />}

            {/* Analytics Split (65% / 35%) */}
            <div className="analytics-split-grid">
              {metricsQuery.data && <RevenueChart metrics={metricsQuery.data} />}
              {channelsQuery.data && <ChannelBreakdown channels={channelsQuery.data} />}
            </div>

            {/* Customer Activity Table */}
            {customersQuery.data && (
              <CustomerTable
                customers={customersQuery.data}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Inspector Panel */}
      <DevToolsInspector />
    </div>
  );
};
