import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { KPICard } from '../components/KPICard';
import { RevenueChart } from '../components/RevenueChart';
import { AcquisitionChart } from '../components/AcquisitionChart';
import { UserTable } from '../components/UserTable';
import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { ErrorState } from '../components/ErrorState';
import { useDashboardData } from '../hooks/useDashboardData';

export const Dashboard = () => {
  const { data, isLoading, error, refetch } = useDashboardData();

  // Loading state
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error as Error} onRetry={() => refetch()} />;
  }

  // Success state
  if (!data) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 min-w-0" role="main" aria-label="Dashboard content">
        <Header />

        <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
          {/* KPI Cards */}
          <section aria-labelledby="kpi-section-title">
            <h2 id="kpi-section-title" className="sr-only">
              Key Performance Indicators
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {data.kpiCards.map((card) => (
                <KPICard key={card.id} card={card} />
              ))}
            </div>
          </section>

          {/* Charts */}
          <section aria-labelledby="charts-section-title">
            <h2 id="charts-section-title" className="sr-only">
              Analytics Charts
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <RevenueChart data={data.revenueData} />
              <AcquisitionChart channels={data.channels} />
            </div>
          </section>

          {/* Users Table */}
          <section aria-labelledby="users-section-title">
            <h2 id="users-section-title" className="sr-only">
              Recent Users
            </h2>
            <UserTable users={data.users} />
          </section>
        </div>
      </main>
    </div>
  );
};