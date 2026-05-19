import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#111118',
            border: '1px solid #e8e8ed',
            borderRadius: '10px',
            fontSize: '13px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
          success: { iconTheme: { primary: '#059669', secondary: '#ffffff' } },
          error:   { iconTheme: { primary: '#dc2626', secondary: '#ffffff' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
