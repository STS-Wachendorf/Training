import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Lade...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
