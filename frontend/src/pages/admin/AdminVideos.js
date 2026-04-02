import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminVideos.css';

const AdminVideos = () => {
  const [videos, setVideos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const empty = { titleAr: '', title: '', descriptionAr: '', description: '', url: '', thumbnail: '', category: 'highlights' };
  const [form, setForm] = useState(empty);

  const fetch = () => axios.get(`/api/videos?limit=${pageSize}&page=${page}`).then(r => {
    setVideos(r.data.videos);
    setPages(r.data.pages || 1);
  });
  useEffect(() => { fetch(); }, [page, pageSize]);

  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages, page]);

  const reset = () => { setForm(empty); setEditing(null); setShowForm(false); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await axios.put(`/api/videos/${editing}`, form);
    else await axios.post('/api/videos', form);
    reset(); fetch();
  };
  const handleEdit = (v) => { setForm({ titleAr: v.titleAr, title: v.title || '', descriptionAr: v.descriptionAr || '', description: v.description || '', url: v.url, thumbnail: v.thumbnail || '', category: v.category }); setEditing(v._id); setShowForm(true); };
  const handleDelete = async (id) => { if (window.confirm('حذف الفيديو؟')) { await axios.delete(`/api/videos/${id}`); fetch(); } };

  const categoryLabels = {
    highlights: 'ملخصات',
    interviews: 'حوارات',
    analysis: 'تحليل',
    other: 'أخرى',
  };

  return (
    <div className="admin-videos">
      <div className="admin-videos-header">
        <h1 className="admin-videos-title">إدارة الفيديوهات</h1>
        <button onClick={() => { reset(); setShowForm(true); }} className="btn-red">+ إضافة فيديو</button>
      </div>
      {showForm && (
        <div className="admin-videos-form-card">
          <h3 className="admin-videos-form-title">{editing ? 'تعديل فيديو' : 'إضافة فيديو'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-videos-form-grid">
              <div>
                <label className="admin-videos-label">العنوان بالعربية *</label>
                <input className="admin-videos-input" value={form.titleAr} onChange={e => setForm({...form, titleAr: e.target.value})} required />
              </div>
              <div>
                <label className="admin-videos-label">العنوان</label>
                <input className="admin-videos-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="admin-videos-span">
                <label className="admin-videos-label">رابط YouTube *</label>
                <input className="admin-videos-input" value={form.url} onChange={e => setForm({...form, url: e.target.value})} required placeholder="https://www.youtube.com/embed/..." />
              </div>
              <div>
                <label className="admin-videos-label">رابط الصورة المصغرة</label>
                <input className="admin-videos-input" value={form.thumbnail} onChange={e => setForm({...form, thumbnail: e.target.value})} />
              </div>
              <div>
                <label className="admin-videos-label">التصنيف</label>
                <select className="admin-videos-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="admin-videos-span">
                <label className="admin-videos-label">الوصف بالعربية</label>
                <textarea className="admin-videos-input admin-videos-textarea" value={form.descriptionAr} onChange={e => setForm({...form, descriptionAr: e.target.value})} />
              </div>
            </div>
            <div className="admin-videos-form-actions">
              <button type="submit" className="btn-red">{editing ? 'حفظ' : 'إضافة'}</button>
              <button type="button" onClick={reset} className="btn-outline">إلغاء</button>
            </div>
          </form>
        </div>
      )}
      <div className="admin-videos-table-card">
        <table className="admin-videos-table">
          <thead>
            <tr className="admin-videos-table-head">
            {['الصورة', 'العنوان', 'التصنيف', 'المشاهدات', 'الإجراءات'].map(h => (
              <th key={h} className="admin-videos-th">{h}</th>
            ))}
            </tr>
          </thead>
          <tbody>
            {videos.map(v => (
              <tr key={v._id} className="admin-videos-tr">
                <td className="admin-videos-td">
                  <img src={v.thumbnail || `https://picsum.photos/seed/${v._id}/80/50`} alt="" className="admin-videos-thumb" />
                </td>
                <td className="admin-videos-td admin-videos-title-cell">
                  <div className="admin-videos-ellipsis">{v.titleAr}</div>
                </td>
                <td className="admin-videos-td">
                  <span className="badge admin-videos-badge">{categoryLabels[v.category] || v.category}</span>
                </td>
                <td className="admin-videos-td admin-videos-muted">👁 {v.views}</td>
                <td className="admin-videos-td">
                  <div className="admin-videos-actions">
                    <button onClick={() => handleEdit(v)} className="admin-videos-btn admin-videos-btn-edit">تعديل</button>
                    <button onClick={() => handleDelete(v._id)} className="admin-videos-btn admin-videos-btn-delete">حذف</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-videos-cards">
        {videos.map(v => (
          <div key={v._id} className="admin-videos-card">
            <div className="admin-videos-card-head">
              <img src={v.thumbnail || `https://picsum.photos/seed/${v._id}/120/80`} alt="" className="admin-videos-card-thumb" />
              <div className="admin-videos-card-info">
                <div className="admin-videos-card-title">{v.titleAr}</div>
                <div className="admin-videos-card-meta">
                  <span className="badge admin-videos-badge">{categoryLabels[v.category] || v.category}</span>
                  <span className="admin-videos-muted">👁 {v.views}</span>
                </div>
              </div>
            </div>
            <div className="admin-videos-card-actions">
              <button onClick={() => handleEdit(v)} className="admin-videos-btn admin-videos-btn-edit">تعديل</button>
              <button onClick={() => handleDelete(v._id)} className="admin-videos-btn admin-videos-btn-delete">حذف</button>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-videos-pagination">
        <div className="admin-videos-page-size">
          <span>عدد الأسطر:</span>
          <select
            className="admin-videos-page-select"
            value={pageSize}
            onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}
          >
            {[5, 10, 20, 30].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <button
          className="admin-videos-page-btn"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          السابق
        </button>
        <div className="admin-videos-page-list">
          {Array.from({ length: pages }, (_, i) => i + 1).slice(0, 7).map(n => (
            <button
              key={n}
              className={`admin-videos-page-number${n === page ? ' is-active' : ''}`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          {pages > 7 && <span className="admin-videos-page-ellipsis">…</span>}
        </div>
        <span className="admin-videos-page-info">صفحة {page} من {pages}</span>
        <button
          className="admin-videos-page-btn"
          onClick={() => setPage(p => Math.min(pages, p + 1))}
          disabled={page === pages}
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default AdminVideos;
