import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const StatCard = ({ label, value, icon, color }) => (
  <div className="admin-stat-card" style={{ borderRight: `4px solid ${color}` }}>
    <div className="admin-stat-row">
      <div>
        <p className="admin-stat-label">{label}</p>
        <p className="admin-stat-value">{value}</p>
      </div>
      <div className="admin-stat-icon" style={{ background: color + '18' }}>{icon}</div>
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

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1 className="admin-title">لوحة التحكم</h1>
        <Link to="/" className="admin-back-link">← العودة للموقع</Link>
      </div>
      <div className="admin-stats-grid">
        {cards.map((c, i) => <StatCard key={i} {...c} />)}
      </div>
    </div>
  );
};

export default AdminDashboard;
