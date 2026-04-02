import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetch = () => axios.get(`/api/admin/users?limit=${pageSize}&page=${page}`).then(r => {
    setUsers(r.data.users || []);
    setPages(r.data.pages || 1);
    setTotal(r.data.total || 0);
  });
  useEffect(() => { fetch(); }, [page, pageSize]);

  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages, page]);

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
        <p className="admin-users-subtitle">إجمالي: {total} مستخدم</p>
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

      <div className="admin-users-cards">
        {users.map(u => (
          <div key={u._id} className="admin-users-card">
            <div className="admin-users-card-head">
              <div className={`admin-users-avatar${u.role === 'admin' ? ' is-admin' : ''}`}>
                {u.name.charAt(0)}
              </div>
              <div className="admin-users-card-info">
                <div className="admin-users-name">{u.name}</div>
                <div className="admin-users-muted">{u.email}</div>
              </div>
              <span className="badge admin-users-badge" style={{ background: u.role === 'admin' ? '#CC0000' : '#555' }}>
                {u.role === 'admin' ? 'مدير' : 'مستخدم'}
              </span>
            </div>
            <div className="admin-users-card-meta">
              <span className="admin-users-date">{formatDate(u.createdAt)}</span>
            </div>
            <div className="admin-users-card-actions">
              <button onClick={() => toggleRole(u._id, u.role)} className={`admin-users-btn ${u.role === 'admin' ? 'admin-users-btn-neutral' : 'admin-users-btn-edit'}`}>
                {u.role === 'admin' ? 'إزالة الصلاحية' : 'منح صلاحية'}
              </button>
              <button onClick={() => handleDelete(u._id)} className="admin-users-btn admin-users-btn-delete">حذف</button>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-users-pagination">
        <div className="admin-users-page-size">
          <span>عدد الأسطر:</span>
          <select
            className="admin-users-page-select"
            value={pageSize}
            onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}
          >
            {[5, 10, 20, 30].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <button
          className="admin-users-page-btn"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          السابق
        </button>
        <div className="admin-users-page-list">
          {Array.from({ length: pages }, (_, i) => i + 1).slice(0, 7).map(n => (
            <button
              key={n}
              className={`admin-users-page-number${n === page ? ' is-active' : ''}`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          {pages > 7 && <span className="admin-users-page-ellipsis">…</span>}
        </div>
        <span className="admin-users-page-info">صفحة {page} من {pages}</span>
        <button
          className="admin-users-page-btn"
          onClick={() => setPage(p => Math.min(pages, p + 1))}
          disabled={page === pages}
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default AdminUsers;
