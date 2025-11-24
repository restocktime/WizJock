import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Reports } from './pages/Reports';
import { Publishing } from './pages/Publishing';
import { Performance } from './pages/Performance';
import { Injuries } from './pages/Injuries';
import { Intelligence } from './pages/Intelligence';
import { LineMovements } from './pages/LineMovements';
import Applications from './pages/Applications';
import { ReportPreview } from './pages/ReportPreview';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Reports />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/publishing"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Publishing />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/performance"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Performance />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/injuries"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Injuries />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/intelligence"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Intelligence />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/line-movements"
              element={
                <ProtectedRoute>
                  <Layout>
                    <LineMovements />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Applications />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/preview/report/:id"
              element={
                <ProtectedRoute>
                  <ReportPreview />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/reports" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
