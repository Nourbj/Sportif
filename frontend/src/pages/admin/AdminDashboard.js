import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const StatCard = ({ label, value, icon, color }) => (
  <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderRight: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '8px' }}>{label}</p>
        <p style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111' }}>{value}</p>
      </div>
      <div style={{ width: '56px', height: '56px', background: color + '18', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>{icon}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    axios.get('/api/admin/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  const cards = [
    { label: 'المستخدمون', value: stats.users || 0, icon: '👥', color: '#CC0000' },
    { label: 'الأخبار', value: stats.news || 0, icon: '📰', color: '#1a73e8' },
    { label: 'المباريات', value: stats.matches || 0, icon: '⚽', color: '#00aa44' },
    { label: 'الفيديوهات', value: stats.videos || 0, icon: '🎥', color: '#ff6b00' },
    { label: 'النجوم', value: stats.stars || 0, icon: '⭐', color: '#FFD700' },
    { label: 'المقالات', value: stats.articles || 0, icon: '✍', color: '#9c27b0' },
  ];

  const quickLinks = [
    { to: '/admin/news', label: 'إدارة الأخبار', icon: '📰', color: '#1a73e8' },
    { to: '/admin/matches', label: 'إدارة المباريات', icon: '⚽', color: '#00aa44' },
    { to: '/admin/videos', label: 'إدارة الفيديوهات', icon: '🎥', color: '#ff6b00' },
    { to: '/admin/stars', label: 'إدارة النجوم', icon: '⭐', color: '#FFD700' },
    { to: '/admin/articles', label: 'إدارة المقالات', icon: '✍', color: '#9c27b0' },
    { to: '/admin/users', label: 'إدارة المستخدمين', icon: '👥', color: '#CC0000' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>لوحة التحكم</h1>
        <Link to="/" style={{ color: '#CC0000', fontWeight: 700 }}>← العودة للموقع</Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {cards.map((c, i) => <StatCard key={i} {...c} />)}
      </div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px', borderRight: '4px solid #CC0000', paddingRight: '12px' }}>الإجراءات السريعة</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {quickLinks.map((l, i) => (
          <Link key={i} to={l.to} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '14px', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)'; }}>
              <div style={{ width: '44px', height: '44px', background: l.color + '18', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{l.icon}</div>
              <span style={{ fontWeight: 700, color: '#111' }}>{l.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
