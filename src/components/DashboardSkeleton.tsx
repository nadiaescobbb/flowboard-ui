import { useThemeClasses } from '../hooks/useThemeClasses';

export function DashboardSkeleton() {
  const classes = useThemeClasses();

  return (
    <div className="flex min-h-screen" role="status" aria-live="polite" aria-label="Loading weekly revenue dashboard data">
      <span className="sr-only">
        Loading KPI cards, revenue charts, acquisition sources, and users.
      </span>
      {/* Sidebar Skeleton */}
      <aside className={`hidden md:flex w-64 flex-shrink-0 flex-col border-r ${classes.surface}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="size-8 bg-[#ded4c3] dark:bg-white/[0.12] rounded-md animate-pulse" />
          <div className="flex-1">
          <div className="h-4 bg-[#ded4c3] dark:bg-white/[0.12] rounded animate-pulse mb-2" />
          <div className="h-3 bg-[#ded4c3] dark:bg-white/[0.12] rounded animate-pulse w-20" />
          </div>
        </div>
      </aside>

      <main className="flex-1">
        {/* Header Skeleton */}
        <header className={`h-16 border-b ${classes.surface}`}>
          <div className="h-full px-8 flex items-center justify-between">
            <div className="h-6 bg-[#ded4c3] dark:bg-white/[0.12] rounded animate-pulse w-32" />
            <div className="flex gap-4">
              <div className="size-9 bg-[#ded4c3] dark:bg-white/[0.12] rounded-md animate-pulse" />
              <div className="size-9 bg-[#ded4c3] dark:bg-white/[0.12] rounded-md animate-pulse" />
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* KPI Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`h-32 rounded-xl ${classes.surface} border animate-pulse`}
              />
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`lg:col-span-2 h-96 rounded-xl ${classes.surface} border animate-pulse`} />
            <div className={`h-96 rounded-xl ${classes.surface} border animate-pulse`} />
          </div>

          {/* Table Skeleton */}
          <div className={`h-96 rounded-xl ${classes.surface} border animate-pulse`} />
        </div>
      </main>
    </div>
  );
}
