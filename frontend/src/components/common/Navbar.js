import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header style={{ background: '#fff', borderBottom: '3px solid #CC0000', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: '70px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/images/logo.jpg" alt="Logo" style={{ height: '55px', width: '55px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #eee' }} />
        </Link>

        {/* Nav Links */}
        <nav style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {[
            { to: '/news', label: 'آخر الأخبار' },
            { to: '/matches', label: 'مباريات اليوم' },
            { to: '/videos', label: 'فيديوهات' },
            { to: '/stars', label: 'نجوم' },
            { to: '/articles', label: 'مقالات و تحليلات' },
          ].map(item => (
            <Link key={item.to} to={item.to} style={{ padding: '8px 14px', borderRadius: '4px', fontWeight: 700, fontSize: '0.9rem', color: '#333', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.target.style.background = '#CC0000'; e.target.style.color = 'white'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#333'; }}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin" style={{ padding: '8px 16px', background: '#CC0000', color: 'white', borderRadius: '4px', fontWeight: 700, fontSize: '0.85rem' }}>لوحة التحكم</Link>}
              <span style={{ fontSize: '0.9rem', color: '#555' }}>مرحباً، {user.name}</span>
              <button onClick={handleLogout} style={{ padding: '8px 16px', border: '2px solid #CC0000', color: '#CC0000', background: 'transparent', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Cairo' }}>خروج</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ padding: '8px 16px', border: '2px solid #CC0000', color: '#CC0000', background: 'transparent', borderRadius: '4px', fontWeight: 700, fontSize: '0.85rem' }}>دخول</Link>
              <Link to="/register" style={{ padding: '8px 16px', background: '#CC0000', color: 'white', borderRadius: '4px', fontWeight: 700, fontSize: '0.85rem' }}>تسجيل</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
