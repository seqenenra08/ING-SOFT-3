import { Outlet } from 'react-router';
import { TopNav } from './TopNav';

export const AppLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f1ee' }}>
      <TopNav />
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};