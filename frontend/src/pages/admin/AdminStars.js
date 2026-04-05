import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import './AdminStars.css';

const AdminStars = () => {
  const [stars, setStars] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const empty = { nameAr: '', name: '', sport: 'Football', nationality: '', nationalityAr: '', club: '', clubAr: '', image: '', bioAr: '', bio: '', videoUrl: '', featured: false };
  const [form, setForm] = useState(empty);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetch = () => axios.get(`/api/stars?limit=${pageSize}&page=${page}`).then(r => {
    setStars(r.data.stars || []);
    setPages(r.data.pages || 1);
  });
  useEffect(() => { fetch(); }, [page, pageSize]);

  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages, page]);

  const reset = () => { 
    setForm(empty); 
    setSelectedFile(null);
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

    if (editing) await axios.put(`/api/stars/${editing}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    else await axios.post('/api/stars', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    
    reset(); fetch();
  };
  const handleEdit = (s) => { setForm({ nameAr: s.nameAr, name: s.name || '', sport: s.sport, nationality: s.nationality, nationalityAr: s.nationalityAr || '', club: s.club || '', clubAr: s.clubAr || '', image: s.image || '', bioAr: s.bioAr || '', bio: s.bio || '', videoUrl: s.videoUrl || '', featured: s.featured }); setEditing(s._id); setShowForm(true); };
  const handleDelete = async (id) => { if (window.confirm('حذف النجم؟')) { await axios.delete(`/api/stars/${id}`); fetch(); } };

  const sportLabels = {
    Football: 'كرة القدم',
    Tennis: 'التنس',
    Basketball: 'كرة السلة',
    Athletics: 'ألعاب القوى',
    Swimming: 'السباحة',
    Other: 'أخرى',
  };

  return (
    <div className="admin-stars">
      <div className="admin-stars-header">
        <h1 className="admin-stars-title">إدارة النجوم</h1>
        <button onClick={() => { reset(); setShowForm(true); }} className="btn-red">+ إضافة نجم</button>
      </div>
      {showForm && (
        <div className="admin-stars-form-card">
          <h3 className="admin-stars-form-title">{editing ? 'تعديل' : 'إضافة نجم'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-stars-form-grid">
              <div>
                <label className="admin-stars-label">الاسم بالعربية *</label>
                <input className="admin-stars-input" value={form.nameAr} onChange={e => setForm({...form, nameAr: e.target.value})} required />
              </div>
              <div>
                <label className="admin-stars-label">الاسم بالإنجليزية</label>
                <input className="admin-stars-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="admin-stars-label">الرياضة *</label>
                <select className="admin-stars-input" value={form.sport} onChange={e => setForm({...form, sport: e.target.value})}>
                  {[
                    { value: 'Football', label: 'كرة القدم' },
                    { value: 'Tennis', label: 'التنس' },
                    { value: 'Basketball', label: 'كرة السلة' },
                    { value: 'Athletics', label: 'ألعاب القوى' },
                    { value: 'Swimming', label: 'السباحة' },
                    { value: 'Other', label: 'أخرى' },
                  ].map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="admin-stars-label">الجنسية</label>
                <input className="admin-stars-input" value={form.nationalityAr} onChange={e => setForm({...form, nationalityAr: e.target.value})} />
              </div>
              <div>
                <label className="admin-stars-label">النادي بالعربية</label>
                <input className="admin-stars-input" value={form.clubAr} onChange={e => setForm({...form, clubAr: e.target.value})} />
              </div>
              <div>
                <label className="admin-stars-label">الصورة (تحميل ملف)</label>
                <input type="file" className="admin-stars-input" onChange={e => setSelectedFile(e.target.files[0])} accept="image/*" />
                {form.image && <div className="admin-stars-image-preview" style={{fontSize:'0.8rem', color:'#666', marginTop:'4px'}}>الصورة الحالية: {form.image.split('/').pop()}</div>}
              </div>
              <div>
                <label className="admin-stars-label">رابط الفيديو</label>
                <input className="admin-stars-input" value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})} placeholder="https://..." />
              </div>
              <div className="admin-stars-span">
                <label className="admin-stars-label">السيرة الذاتية بالعربية</label>
                <textarea className="admin-stars-input admin-stars-textarea" value={form.bioAr} onChange={e => setForm({...form, bioAr: e.target.value})} />
              </div>
              <div className="admin-stars-check">
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} />
                <label htmlFor="featured" className="admin-stars-check-label">نجم مميز</label>
              </div>
            </div>
            <div className="admin-stars-form-actions">
              <button type="submit" className="btn-red">{editing ? 'حفظ' : 'إضافة'}</button>
              <button type="button" onClick={reset} className="btn-outline">إلغاء</button>
            </div>
          </form>
        </div>
      )}
      <div className="admin-stars-grid">
        {stars.map(s => (
          <div key={s._id} className="admin-stars-card">
            <img src={getFullImageUrl(s.image) || `https://picsum.photos/seed/${s._id}/100/100`} alt="" className="admin-stars-avatar" />
            <h4 className="admin-stars-name">{s.nameAr} {s.videoUrl && '📹'}</h4>
            <p className="admin-stars-sport">{sportLabels[s.sport] || s.sport}</p>
            <div className="admin-stars-actions">
              <button onClick={() => handleEdit(s)} className="admin-stars-btn admin-stars-btn-edit">تعديل</button>
              <button onClick={() => handleDelete(s._id)} className="admin-stars-btn admin-stars-btn-delete">حذف</button>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-stars-pagination">
        <div className="admin-stars-page-size">
          <span>عدد الأسطر:</span>
          <select
            className="admin-stars-page-select"
            value={pageSize}
            onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}
          >
            {[6, 12, 24, 36].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <button
          className="admin-stars-page-btn"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          السابق
        </button>
        <div className="admin-stars-page-list">
          {Array.from({ length: pages }, (_, i) => i + 1).slice(0, 7).map(n => (
            <button
              key={n}
              className={`admin-stars-page-number${n === page ? ' is-active' : ''}`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          {pages > 7 && <span className="admin-stars-page-ellipsis">…</span>}
        </div>
        <span className="admin-stars-page-info">صفحة {page} من {pages}</span>
        <button
          className="admin-stars-page-btn"
          onClick={() => setPage(p => Math.min(pages, p + 1))}
          disabled={page === pages}
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default AdminStars;
