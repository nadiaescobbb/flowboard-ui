import { useThemeClasses } from '../hooks/useThemeClasses';
import { Icon } from './Icon';

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const classes = useThemeClasses();

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className={`max-w-md text-center p-8 rounded-xl ${classes.surface} border`}>
        <div className="size-16 mx-auto mb-4 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center">
          <Icon name="error" className="text-rose-600 dark:text-rose-500 !text-3xl" />
        </div>

        <h2 className={`text-xl font-bold mb-2 ${classes.title}`}>
          Oops! Something went wrong
        </h2>

        <p className={`text-sm mb-6 ${classes.subtitle}`}>
          {error.message || 'Failed to load dashboard data'}
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}