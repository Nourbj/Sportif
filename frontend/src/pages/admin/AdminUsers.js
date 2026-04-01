import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const fetch = () => axios.get('/api/admin/users').then(r => setUsers(r.data));
  useEffect(() => { fetch(); }, []);

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (window.confirm(`تغيير الدور إلى ${newRole}؟`)) { await axios.put(`/api/admin/users/${id}/role`, { role: newRole }); fetch(); }
  };
  const handleDelete = async (id) => { if (window.confirm('حذف المستخدم؟')) { await axios.delete(`/api/admin/users/${id}`); fetch(); } };
  const formatDate = (d) => new Date(d).toLocaleDateString('ar-TN');

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900 }}>إدارة المستخدمين</h1>
        <p style={{ color: '#888', marginTop: '6px' }}>إجمالي: {users.length} مستخدم</p>
      </div>
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#f9f9f9', borderBottom: '2px solid #eee' }}>
            {['الاسم', 'البريد الإلكتروني', 'الدور', 'تاريخ التسجيل', 'الإجراءات'].map(h => (
              <th key={h} style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#555', fontSize: '0.9rem' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', background: u.role === 'admin' ? '#CC0000' : '#ddd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: u.role === 'admin' ? 'white' : '#555', fontWeight: 700, fontSize: '0.9rem' }}>
                      {u.name.charAt(0)}
                    </div>
                    <span style={{ fontWeight: 700 }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', color: '#666' }}>{u.email}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span className="badge" style={{ background: u.role === 'admin' ? '#CC0000' : '#555', color: 'white', fontSize: '0.78rem' }}>
                    {u.role === 'admin' ? 'مدير' : 'مستخدم'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: '#888', fontSize: '0.85rem' }}>{formatDate(u.createdAt)}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => toggleRole(u._id, u.role)} style={{ padding: '6px 14px', background: u.role === 'admin' ? '#555' : '#1a73e8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Cairo', fontWeight: 700, fontSize: '0.78rem' }}>
                      {u.role === 'admin' ? 'إزالة الصلاحية' : 'منح صلاحية'}
                    </button>
                    <button onClick={() => handleDelete(u._id)} style={{ padding: '6px 14px', background: '#CC0000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Cairo', fontWeight: 700, fontSize: '0.78rem' }}>حذف</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
