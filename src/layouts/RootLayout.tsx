import { Outlet } from 'react-router';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
