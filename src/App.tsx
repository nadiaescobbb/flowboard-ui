import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { SimulationProvider } from './contexts/SimulationContext';
import { DashboardPage } from './pages/DashboardPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SimulationProvider>
          <DashboardPage />
        </SimulationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
