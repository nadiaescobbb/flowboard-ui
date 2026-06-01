import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from './pages/Dashboard';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Icon } from './components/Icon';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

function AppContent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`${
        theme === 'dark' ? 'bg-background-dark text-text-primary-dark' : 'bg-background-light text-text-primary-light'
      } min-h-screen min-h-[100dvh] transition-colors duration-300 overflow-x-hidden`}
    >
      <Dashboard />

      <button
        onClick={toggleTheme}
        className="fixed bottom-5 left-5 md:bottom-7 md:left-7 z-[95] size-11 border border-primary/25 bg-primary text-[#fffaf0] rounded-md shadow-[0_16px_40px_rgba(199,111,79,0.24)] hover:-translate-y-0.5 active:scale-95 transition-all touch-manipulation"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <Icon name={theme === 'light' ? 'dark_mode' : 'light_mode'} />
      </button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
