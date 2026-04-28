import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';

export function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Lade...</div>;
  if (user) return <Navigate to="/" replace />; // Defaults to Wartebereich/Home

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <Outlet />
    </div>
  );
}
