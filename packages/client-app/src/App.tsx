import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';

import { SportPicksContainer } from './components/SportPicksContainer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchInterval: 1000 * 60, // Auto-refetch every minute
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/nfl" replace />} />
              <Route path=":sport" element={<SportPicksContainer />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
