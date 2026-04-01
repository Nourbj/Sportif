import React from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  if (!user || user.role !== 'admin') return <Navigate to="/login" />;

  const navItems = [
    { to: '/admin', icon: '📊', label: 'لوحة التحكم', exact: true },
    { to: '/admin/news', icon: '📰', label: 'الأخبار' },
    { to: '/admin/matches', icon: '⚽', label: 'المباريات' },
    { to: '/admin/videos', icon: '🎥', label: 'الفيديوهات' },
    { to: '/admin/stars', icon: '⭐', label: 'النجوم' },
    { to: '/admin/articles', icon: '✍', label: 'المقالات' },
    { to: '/admin/users', icon: '👥', label: 'المستخدمون' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f5f7' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', background: '#0A0A0A', position: 'fixed', top: 0, right: 0, bottom: 0, overflowY: 'auto', zIndex: 100 }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #222' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '38px', height: '38px', background: '#CC0000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Oswald', fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>S</div>
            <span style={{ fontFamily: 'Oswald', fontSize: '1.1rem', fontWeight: 700, color: '#CC0000' }}>SPORTIF.TN</span>
          </Link>
          <p style={{ color: '#555', fontSize: '0.8rem', marginTop: '8px' }}>لوحة الإدارة</p>
        </div>
        <nav style={{ padding: '16px 0' }}>
          {navItems.map(item => {
            const isActive = item.exact ? pathname === item.to : pathname.startsWith(item.to) && item.to !== '/admin';
            const exactActive = item.exact && pathname === '/admin';
            const active = isActive || exactActive;
            return (
              <Link key={item.to} to={item.to}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', color: active ? 'white' : '#888', background: active ? '#CC0000' : 'transparent', fontWeight: active ? 700 : 400, textDecoration: 'none', transition: 'all 0.2s', margin: '2px 0' }}>
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                <span style={{ fontSize: '0.92rem' }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: '20px', borderTop: '1px solid #222', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <Link to="/" style={{ color: '#888', fontSize: '0.85rem', textDecoration: 'none' }}>← العودة للموقع</Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginRight: '240px', flex: 1, padding: '32px', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
