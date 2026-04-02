import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
      <div style={{ background: 'white', padding: '50px 40px', borderRadius: '12px', width: '420px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <img src="/images/logo.jpg" alt="Logo" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', display: 'block' }} />
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#111' }}>تسجيل الدخول</h1>
          <p style={{ color: '#888', marginTop: '6px' }}>مرحباً بك في Sportif.tn</p>
        </div>
        {error && <div style={{ background: '#fff5f5', color: '#CC0000', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight: 600 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#333' }}>البريد الإلكتروني</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e5e5', borderRadius: '8px', fontFamily: 'Cairo', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#CC0000'} onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#333' }}>كلمة المرور</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e5e5', borderRadius: '8px', fontFamily: 'Cairo', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#CC0000'} onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#CC0000', color: 'white', border: 'none', borderRadius: '8px', fontFamily: 'Cairo', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'جار الدخول...' : 'دخول'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '0.9rem' }}>
          ليس لديك حساب؟ <Link to="/register" style={{ color: '#CC0000', fontWeight: 700 }}>إنشاء حساب</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
