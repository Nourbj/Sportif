import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في التسجيل');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
      <div style={{ background: 'white', padding: '50px 40px', borderRadius: '12px', width: '420px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ width: '56px', height: '56px', background: '#CC0000', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Oswald', fontSize: '1.6rem', fontWeight: 700, color: 'white', margin: '0 auto 12px' }}>S</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#111' }}>إنشاء حساب</h1>
        </div>
        {error && <div style={{ background: '#fff5f5', color: '#CC0000', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight: 600 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {[{ key: 'name', label: 'الاسم الكامل', type: 'text' }, { key: 'email', label: 'البريد الإلكتروني', type: 'email' }, { key: 'password', label: 'كلمة المرور', type: 'password' }].map(f => (
            <div key={f.key} style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#333' }}>{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e5e5', borderRadius: '8px', fontFamily: 'Cairo', fontSize: '0.95rem', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#CC0000'} onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#CC0000', color: 'white', border: 'none', borderRadius: '8px', fontFamily: 'Cairo', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1, marginTop: '8px' }}>
            {loading ? 'جار التسجيل...' : 'إنشاء حساب'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '0.9rem' }}>
          لديك حساب؟ <Link to="/login" style={{ color: '#CC0000', fontWeight: 700 }}>تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
