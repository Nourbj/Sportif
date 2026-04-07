import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import './AdminArticles.css';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminMediaInput from '../../components/admin/AdminMediaInput';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const empty = { titleAr: '', title: '', contentAr: '', content: '', type: 'analysis', image: '', videoUrl: '' };
  const [form, setForm] = useState(empty);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);

  const fetch = () => axios.get(`/api/articles?limit=${pageSize}&page=${page}`).then(r => {
    setArticles(r.data.articles);
    setPages(r.data.pages || 1);
    setTotal(r.data.total || 0);
  });
  useEffect(() => { fetch(); }, [page, pageSize]);

  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages, page]);

  const reset = () => { 
    setForm(empty); 
    setSelectedFile(null);
    setSelectedVideoFile(null);
    setEditing(null); 
    setShowForm(false); 
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });
    if (selectedFile) {
      formData.append('image', selectedFile);
    }
    if (selectedVideoFile) {
      formData.append('video', selectedVideoFile);
    }

    if (editing) await axios.put(`/api/articles/${editing}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    else await axios.post('/api/articles', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    
    reset(); fetch();
  };
  const handleEdit = (a) => { 
    setForm({ titleAr: a.titleAr, title: a.title || '', contentAr: a.contentAr, content: a.content || '', type: a.type, image: a.image || '', videoUrl: a.videoUrl || '' });
    setSelectedFile(null);
    setSelectedVideoFile(null);
    setEditing(a._id); 
    setShowForm(true); 
  };
  const handleDelete = async (id) => { if (window.confirm('حذف المقال؟')) { await axios.delete(`/api/articles/${id}`); fetch(); } };

  const formatDate = (d) => new Date(d).toLocaleDateString('ar-TN');
  return (
    <div className="admin-articles">
      <AdminPageHeader
        title="إدارة المقالات"
        subtitle={`إجمالي: ${total} مقال`}
        action={<button onClick={() => { reset(); setShowForm(true); }} className="btn-red">+ إضافة مقال</button>}
      />
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
              <div>
                <AdminMediaInput
                  label="الصورة"
                  type="image"
                  file={selectedFile}
                  setFile={setSelectedFile}
                  value={form.image}
                  onValueChange={(val) => setForm({ ...form, image: val })}
                  hint="JPG, PNG, WebP"
                />
              </div>
              <div>
                <AdminMediaInput
                  label="الفيديو"
                  type="video"
                  file={selectedVideoFile}
                  setFile={setSelectedVideoFile}
                  value={form.videoUrl}
                  onValueChange={(val) => setForm({ ...form, videoUrl: val })}
                  hint="MP4, WebM, Ogg"
                />
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
            {['الصورة', 'العنوان', 'النوع', 'القراءات', 'فيديو', 'التاريخ', 'الإجراءات'].map(h => (
              <th key={h} className="admin-articles-th">{h}</th>
            ))}
            </tr>
          </thead>
          <tbody>
            {articles.map(a => (
              <tr key={a._id} className="admin-articles-tr">
                <td className="admin-articles-td">
                  <img src={getFullImageUrl(a.image) || `https://picsum.photos/seed/${a._id}/70/44`} alt="" className="admin-articles-thumb" />
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
                <td className="admin-articles-td">{a.videoUrl ? '📹' : '—'}</td>
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

      <div className="admin-articles-cards">
        {articles.map(a => (
          <div key={a._id} className="admin-articles-card">
            <div className="admin-articles-card-head">
              <img src={getFullImageUrl(a.image) || `https://picsum.photos/seed/${a._id}/120/80`} alt="" className="admin-articles-card-thumb" />
              <div className="admin-articles-card-info">
                <div className="admin-articles-card-title">{a.titleAr}</div>
                <div className="admin-articles-card-meta">
                  <span className="badge admin-articles-badge" style={{ background: a.type === 'analysis' ? '#1a73e8' : a.type === 'opinion' ? '#e8a01a' : '#1aae6f' }}>
                    {a.type === 'analysis' ? 'تحليل' : a.type === 'opinion' ? 'رأي' : 'تقرير'}
                  </span>
                  <span className="admin-articles-muted">👁 {a.views}</span>
                  <span className="admin-articles-date">{formatDate(a.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="admin-articles-card-actions">
              <button onClick={() => handleEdit(a)} className="admin-articles-btn admin-articles-btn-edit">تعديل</button>
              <button onClick={() => handleDelete(a._id)} className="admin-articles-btn admin-articles-btn-delete">حذف</button>
            </div>
          </div>
        ))}
      </div>

      <AdminPagination
        page={page}
        pages={pages}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(n) => { setPage(1); setPageSize(n); }}
      />
    </div>
  );
};

export default AdminArticles;
