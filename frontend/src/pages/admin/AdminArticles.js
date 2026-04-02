import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminArticles.css';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const empty = { titleAr: '', title: '', contentAr: '', content: '', type: 'analysis', image: '' };
  const [form, setForm] = useState(empty);

  const fetch = () => axios.get('/api/articles?limit=50').then(r => setArticles(r.data.articles));
  useEffect(() => { fetch(); }, []);

  const reset = () => { setForm(empty); setEditing(null); setShowForm(false); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await axios.put(`/api/articles/${editing}`, form);
    else await axios.post('/api/articles', form);
    reset(); fetch();
  };
  const handleEdit = (a) => { setForm({ titleAr: a.titleAr, title: a.title || '', contentAr: a.contentAr, content: a.content || '', type: a.type, image: a.image || '' }); setEditing(a._id); setShowForm(true); };
  const handleDelete = async (id) => { if (window.confirm('حذف المقال؟')) { await axios.delete(`/api/articles/${id}`); fetch(); } };

  const formatDate = (d) => new Date(d).toLocaleDateString('ar-TN');

  return (
    <div className="admin-articles">
      <div className="admin-articles-header">
        <h1 className="admin-articles-title">إدارة المقالات</h1>
        <button onClick={() => { reset(); setShowForm(true); }} className="btn-red">+ إضافة مقال</button>
      </div>
      {showForm && (
        <div className="admin-articles-form-card">
          <h3 className="admin-articles-form-title">{editing ? 'تعديل مقال' : 'إضافة مقال'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-articles-form-grid">
              <div>
                <label className="admin-articles-label">العنوان بالعربية *</label>
                <input className="admin-articles-input" value={form.titleAr} onChange={e => setForm({...form, titleAr: e.target.value})} required />
              </div>
              <div>
                <label className="admin-articles-label">النوع</label>
                <select className="admin-articles-input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="analysis">تحليل</option><option value="opinion">رأي</option><option value="report">تقرير</option>
                </select>
              </div>
              <div className="admin-articles-span">
                <label className="admin-articles-label">المحتوى بالعربية *</label>
                <textarea className="admin-articles-input admin-articles-textarea" value={form.contentAr} onChange={e => setForm({...form, contentAr: e.target.value})} required />
              </div>
              <div className="admin-articles-span">
                <label className="admin-articles-label">رابط الصورة</label>
                <input className="admin-articles-input" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
              </div>
            </div>
            <div className="admin-articles-form-actions">
              <button type="submit" className="btn-red">{editing ? 'حفظ' : 'نشر'}</button>
              <button type="button" onClick={reset} className="btn-outline">إلغاء</button>
            </div>
          </form>
        </div>
      )}
      <div className="admin-articles-table-card">
        <table className="admin-articles-table">
          <thead>
            <tr className="admin-articles-table-head">
            {['الصورة', 'العنوان', 'النوع', 'القراءات', 'التاريخ', 'الإجراءات'].map(h => (
              <th key={h} className="admin-articles-th">{h}</th>
            ))}
            </tr>
          </thead>
          <tbody>
            {articles.map(a => (
              <tr key={a._id} className="admin-articles-tr">
                <td className="admin-articles-td">
                  <img src={a.image || `https://picsum.photos/seed/${a._id}/70/44`} alt="" className="admin-articles-thumb" />
                </td>
                <td className="admin-articles-td admin-articles-title-cell">
                  <div className="admin-articles-ellipsis">{a.titleAr}</div>
                </td>
                <td className="admin-articles-td">
                  <span className="badge admin-articles-badge" style={{ background: a.type === 'analysis' ? '#1a73e8' : a.type === 'opinion' ? '#e8a01a' : '#1aae6f' }}>
                    {a.type === 'analysis' ? 'تحليل' : a.type === 'opinion' ? 'رأي' : 'تقرير'}
                  </span>
                </td>
                <td className="admin-articles-td admin-articles-muted">👁 {a.views}</td>
                <td className="admin-articles-td admin-articles-date">{formatDate(a.createdAt)}</td>
                <td className="admin-articles-td">
                  <div className="admin-articles-actions">
                    <button onClick={() => handleEdit(a)} className="admin-articles-btn admin-articles-btn-edit">تعديل</button>
                    <button onClick={() => handleDelete(a._id)} className="admin-articles-btn admin-articles-btn-delete">حذف</button>
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

export default AdminArticles;
