import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { PatientDetail } from './pages/PatientDetail';
import { AIAssistant } from './pages/AIAssistant';
import { Settings } from './pages/Settings';

function PrivateLayout({ children, title }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title={title} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <PrivateLayout title="Dashboard">
                    <Dashboard />
                  </PrivateLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/patients"
              element={
                <RequireAuth>
                  <PrivateLayout title="Patients">
                    <Patients />
                  </PrivateLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/patients/:id"
              element={
                <RequireAuth>
                  <PrivateLayout title="Patient Detail">
                    <PatientDetail />
                  </PrivateLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/ai"
              element={
                <RequireAuth>
                  <PrivateLayout title="AI Assistant">
                    <AIAssistant />
                  </PrivateLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/settings"
              element={
                <RequireAuth>
                  <PrivateLayout title="Settings">
                    <Settings />
                  </PrivateLayout>
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
