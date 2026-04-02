import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminNews.css';

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ titleAr: '', title: '', contentAr: '', content: '', category: 'football', image: '', featured: false });

  const fetchNews = () => {
    setLoading(true);
    axios.get('/api/news?limit=50').then(r => setNews(r.data.news)).finally(() => setLoading(false));
  };
  useEffect(() => { fetchNews(); }, []);

  const resetForm = () => { setForm({ titleAr: '', title: '', contentAr: '', content: '', category: 'football', image: '', featured: false }); setEditing(null); setShowForm(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await axios.put(`/api/news/${editing}`, form);
    else await axios.post('/api/news', form);
    resetForm(); fetchNews();
  };

  const handleEdit = (n) => { setForm({ titleAr: n.titleAr, title: n.title, contentAr: n.contentAr, content: n.content, category: n.category, image: n.image || '', featured: n.featured }); setEditing(n._id); setShowForm(true); };
  const handleDelete = async (id) => { if (window.confirm('هل تريد حذف هذا الخبر؟')) { await axios.delete(`/api/news/${id}`); fetchNews(); } };

  return (
    <div className="admin-news">
      <div className="admin-news-header">
        <h1 className="admin-news-title">إدارة الأخبار</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-red">+ إضافة خبر</button>
      </div>

      {showForm && (
        <div className="admin-news-form-card">
          <h3 className="admin-news-form-title">{editing ? 'تعديل الخبر' : 'إضافة خبر جديد'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-news-form-grid">
              <div>
                <label className="admin-news-label">العنوان بالعربية *</label>
                <input className="admin-news-input" value={form.titleAr} onChange={e => setForm({...form, titleAr: e.target.value})} required />
              </div>
              <div>
                <label className="admin-news-label">العنوان بالفرنسية/الإنجليزية</label>
                <input className="admin-news-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="admin-news-span">
                <label className="admin-news-label">المحتوى بالعربية *</label>
                <textarea className="admin-news-input admin-news-textarea-lg" value={form.contentAr} onChange={e => setForm({...form, contentAr: e.target.value})} required />
              </div>
              <div className="admin-news-span">
                <label className="admin-news-label">المحتوى بالفرنسية/الإنجليزية</label>
                <textarea className="admin-news-input admin-news-textarea-md" value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
              </div>
              <div>
                <label className="admin-news-label">التصنيف</label>
                <select className="admin-news-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {['football','basketball','tennis','local','international','other'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-news-label">رابط الصورة</label>
                <input className="admin-news-input" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
              </div>
              <div className="admin-news-check">
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} />
                <label htmlFor="featured" className="admin-news-check-label">خبر مميز</label>
              </div>
            </div>
            <div className="admin-news-form-actions">
              <button type="submit" className="btn-red">{editing ? 'حفظ التعديلات' : 'نشر الخبر'}</button>
              <button type="button" onClick={resetForm} className="btn-outline">إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="admin-news-loading">⏳ جار التحميل...</div> : (
        <div className="admin-news-table-card">
          <table className="admin-news-table">
            <thead>
              <tr className="admin-news-table-head">
                {['الصورة', 'العنوان', 'التصنيف', 'المشاهدات', 'مميز', 'الإجراءات'].map(h => (
                  <th key={h} className="admin-news-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {news.map(n => (
                <tr key={n._id} className="admin-news-tr">
                  <td className="admin-news-td">
                    <img src={n.image || `https://picsum.photos/seed/${n._id}/60/40`} alt="" className="admin-news-thumb" />
                  </td>
                  <td className="admin-news-td admin-news-title-cell">
                    <div className="admin-news-ellipsis">{n.titleAr}</div>
                  </td>
                  <td className="admin-news-td">
                    <span className="badge badge-red admin-news-badge">{n.category}</span>
                  </td>
                  <td className="admin-news-td admin-news-muted">👁 {n.views}</td>
                  <td className="admin-news-td">{n.featured ? '⭐' : '—'}</td>
                  <td className="admin-news-td">
                    <div className="admin-news-actions">
                      <button onClick={() => handleEdit(n)} className="admin-news-btn admin-news-btn-edit">تعديل</button>
                      <button onClick={() => handleDelete(n._id)} className="admin-news-btn admin-news-btn-delete">حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminNews;
