import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminUsers.css';

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
    <div className="admin-users">
      <div className="admin-users-header">
        <h1 className="admin-users-title">إدارة المستخدمين</h1>
        <p className="admin-users-subtitle">إجمالي: {users.length} مستخدم</p>
      </div>
      <div className="admin-users-table-card">
        <table className="admin-users-table">
          <thead>
            <tr className="admin-users-table-head">
            {['الاسم', 'البريد الإلكتروني', 'الدور', 'تاريخ التسجيل', 'الإجراءات'].map(h => (
              <th key={h} className="admin-users-th">{h}</th>
            ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="admin-users-tr">
                <td className="admin-users-td">
                  <div className="admin-users-user">
                    <div className={`admin-users-avatar${u.role === 'admin' ? ' is-admin' : ''}`}>
                      {u.name.charAt(0)}
                    </div>
                    <span className="admin-users-name">{u.name}</span>
                  </div>
                </td>
                <td className="admin-users-td admin-users-muted">{u.email}</td>
                <td className="admin-users-td">
                  <span className="badge admin-users-badge" style={{ background: u.role === 'admin' ? '#CC0000' : '#555' }}>
                    {u.role === 'admin' ? 'مدير' : 'مستخدم'}
                  </span>
                </td>
                <td className="admin-users-td admin-users-date">{formatDate(u.createdAt)}</td>
                <td className="admin-users-td">
                  <div className="admin-users-actions">
                    <button onClick={() => toggleRole(u._id, u.role)} className={`admin-users-btn ${u.role === 'admin' ? 'admin-users-btn-neutral' : 'admin-users-btn-edit'}`}>
                      {u.role === 'admin' ? 'إزالة الصلاحية' : 'منح صلاحية'}
                    </button>
                    <button onClick={() => handleDelete(u._id)} className="admin-users-btn admin-users-btn-delete">حذف</button>
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
