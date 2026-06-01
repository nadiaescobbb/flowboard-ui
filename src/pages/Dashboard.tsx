import { useCallback, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { KPICard } from '../components/KPICard';
import { RevenueChart } from '../components/RevenueChart';
import { AcquisitionChart } from '../components/AcquisitionChart';
import { UserTable } from '../components/user-table';
import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { ErrorState } from '../components/ErrorState';
import { useDashboardData } from '../hooks/useDashboardData';

export const Dashboard = () => {
  const { data, isLoading, error, refetch } = useDashboardData();
  const [globalUserSearch, setGlobalUserSearch] = useState('');
  const [supportMessage, setSupportMessage] = useState<string | null>(null);

  const scrollToSection = useCallback((sectionId: string) => {
    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }, []);

  const handleGlobalSearch = useCallback((query: string) => {
    setGlobalUserSearch(query);
    scrollToSection('users');
  }, [scrollToSection]);

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
      <Sidebar onNavigate={scrollToSection} />

      <main className="flex-1 min-w-0" role="main" aria-label="Review weekly revenue performance">
        <Header onGlobalSearch={handleGlobalSearch} />

        <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
          <section id="overview" aria-labelledby="kpi-section-title" className="scroll-mt-28">
            <h2 id="kpi-section-title" className="sr-only">
              Key performance indicators
            </h2>
            <div className="work-surface grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden rounded-md border border-border-light dark:border-border-dark bg-surface-light/82 dark:bg-surface-dark/88">
              {data.kpiCards.map((card) => (
                <KPICard key={card.id} card={card} />
              ))}
            </div>
          </section>

          <section id="analytics" aria-labelledby="charts-section-title" className="scroll-mt-28">
            <h2 id="charts-section-title" className="sr-only">
              Analytics charts
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <RevenueChart data={data.revenueData} />
              <AcquisitionChart channels={data.channels} />
            </div>
          </section>

          <section id="users" aria-labelledby="users-section-title" className="scroll-mt-28">
            <h2 id="users-section-title" className="sr-only">
              Recent users
            </h2>
            <UserTable users={data.users} externalSearchQuery={globalUserSearch} />
          </section>

          <section id="revenue" aria-labelledby="revenue-section-title" className="scroll-mt-28">
            <div className="work-surface rounded-md border border-border-light dark:border-border-dark bg-surface-light/82 dark:bg-surface-dark/88 p-5 md:p-6">
              <p className="editorial-label text-text-secondary-light dark:text-text-secondary-dark">
                Revenue workspace
              </p>
              <h2 id="revenue-section-title" className="mt-1 text-xl font-display font-extrabold text-text-primary-light dark:text-text-primary-dark">
                Revenue review queue
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary-light dark:text-text-secondary-dark">
                Segment channel performance, review MRR risk, and prepare the next weekly revenue brief.
              </p>
            </div>
          </section>

          <section id="settings" aria-labelledby="settings-section-title" className="scroll-mt-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div className="work-surface rounded-md border border-border-light dark:border-border-dark bg-surface-light/82 dark:bg-surface-dark/88 p-5 md:p-6">
                <p className="editorial-label text-text-secondary-light dark:text-text-secondary-dark">
                  Settings
                </p>
                <h2 id="settings-section-title" className="mt-1 text-xl font-display font-extrabold text-text-primary-light dark:text-text-primary-dark">
                  Revenue workspace controls
                </h2>
                <div className="mt-5 space-y-3">
                  {['Weekly revenue brief', 'MRR risk alerts', 'Access review cadence'].map((item) => (
                    <label key={item} className="flex items-center justify-between gap-4 rounded-md border border-border-light dark:border-border-dark px-4 py-3">
                      <span className="text-sm font-display font-semibold text-text-primary-light dark:text-text-primary-dark">
                        {item}
                      </span>
                      <input type="checkbox" defaultChecked className="size-4 accent-primary" />
                    </label>
                  ))}
                </div>
              </div>

              <div id="support" className="work-surface rounded-md border border-border-light dark:border-border-dark bg-surface-light/82 dark:bg-surface-dark/88 p-5 md:p-6 scroll-mt-28">
                <p className="editorial-label text-text-secondary-light dark:text-text-secondary-dark">
                  Support
                </p>
                <h2 className="mt-1 text-xl font-display font-extrabold text-text-primary-light dark:text-text-primary-dark">
                  Send a support note
                </h2>
                <p className="mt-2 text-sm leading-6 text-text-secondary-light dark:text-text-secondary-dark">
                  Describe a data issue, export need, or revenue operations question.
                </p>
                {supportMessage && (
                  <div className="mt-4 rounded-md border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-primary" role="status">
                    {supportMessage}
                  </div>
                )}
                <button
                  onClick={() => setSupportMessage('Support note prepared in this demo. No request was sent.')}
                  className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-display font-semibold text-[#fffdf8] hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  Prepare support note
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
