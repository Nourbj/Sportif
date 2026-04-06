import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import { getFullVideoUrl, getYouTubeEmbedUrl } from '../../utils/videoUtils';
import './AdminStars.css';

const AdminStars = () => {
  const [stars, setStars] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const empty = { nameAr: '', name: '', sport: 'Football', position: '', age: '', nationality: '', nationalityAr: '', nationalityFlag: '', club: '', clubAr: '', image: '', bioAr: '', bio: '', videoUrl: '', featured: false };
  const [form, setForm] = useState(empty);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');

  const fetch = () => axios.get(`/api/stars?limit=${pageSize}&page=${page}`).then(r => {
    setStars(r.data.stars || []);
    setPages(r.data.pages || 1);
  });
  useEffect(() => { fetch(); }, [page, pageSize]);

  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages, page]);

  useEffect(() => {
    if (!selectedFile) { setFilePreview(''); return; }
    const url = URL.createObjectURL(selectedFile);
    setFilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  useEffect(() => {
    if (!selectedVideoFile) { setVideoPreview(''); return; }
    const url = URL.createObjectURL(selectedVideoFile);
    setVideoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedVideoFile]);

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

    if (editing) await axios.put(`/api/stars/${editing}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    else await axios.post('/api/stars', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    
    reset(); fetch();
  };
  const handleEdit = (s) => { 
    setForm({ nameAr: s.nameAr, name: s.name || '', sport: s.sport, position: s.position || '', age: s.age || '', nationality: s.nationality || '', nationalityAr: s.nationalityAr || '', nationalityFlag: s.nationalityFlag || '', club: s.club || '', clubAr: s.clubAr || '', image: s.image || '', bioAr: s.bioAr || '', bio: s.bio || '', videoUrl: s.videoUrl || '', featured: s.featured });
    setSelectedFile(null);
    setSelectedVideoFile(null);
    setEditing(s._id); 
    setShowForm(true); 
  };
  const handleDelete = async (id) => { if (window.confirm('حذف النجم؟')) { await axios.delete(`/api/stars/${id}`); fetch(); } };

  const sportLabels = {
    Football: 'كرة القدم',
    Tennis: 'التنس',
    Basketball: 'كرة السلة',
    Athletics: 'ألعاب القوى',
    Swimming: 'السباحة',
    Other: 'أخرى',
  };
  const youtubeEmbed = getYouTubeEmbedUrl(form.videoUrl);

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
                <label className="admin-stars-label">المركز</label>
                <input className="admin-stars-input" value={form.position} onChange={e => setForm({...form, position: e.target.value})} />
              </div>
              <div>
                <label className="admin-stars-label">العمر</label>
                <input className="admin-stars-input" type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} min="0" />
              </div>
              <div>
                <label className="admin-stars-label">العلم</label>
                <input className="admin-stars-input" value={form.nationalityFlag} onChange={e => setForm({...form, nationalityFlag: e.target.value})} placeholder="🇹🇳" />
              </div>
              <div>
                <label className="admin-stars-label">الجنسية</label>
                <input className="admin-stars-input" value={form.nationalityAr} onChange={e => setForm({...form, nationalityAr: e.target.value})} />
              </div>
              <div>
                <label className="admin-stars-label">الجنسية بالإنجليزية</label>
                <input className="admin-stars-input" value={form.nationality} onChange={e => setForm({...form, nationality: e.target.value})} />
              </div>
              <div>
                <label className="admin-stars-label">النادي بالإنجليزية</label>
                <input className="admin-stars-input" value={form.club} onChange={e => setForm({...form, club: e.target.value})} />
              </div>
              <div>
                <label className="admin-stars-label">النادي بالعربية</label>
                <input className="admin-stars-input" value={form.clubAr} onChange={e => setForm({...form, clubAr: e.target.value})} />
              </div>
              <div>
                <label className="admin-stars-label">الصورة (تحميل ملف)</label>
                <label className="admin-image-upload-box">
                  <input
                    type="file"
                    className="admin-image-file-input"
                    onChange={e => { setSelectedFile(e.target.files[0]); setForm({...form, image: ''}); }}
                    accept="image/*"
                  />
                  <span className="admin-image-upload-icon">+</span>
                  <span className="admin-image-upload-text">تحميل صورة</span>
                </label>
                <label className="admin-stars-label" style={{ marginTop: '8px' }}>أو رابط الصورة</label>
                <input
                  className="admin-stars-input"
                  value={form.image}
                  onChange={e => { setForm({...form, image: e.target.value}); setSelectedFile(null); }}
                  placeholder="https://..."
                />
                {(filePreview || form.image) && (
                  <div className="admin-image-preview" style={{ marginTop: '8px' }}>
                    <img src={filePreview || getFullImageUrl(form.image)} alt="" />
                    <button
                      type="button"
                      className="admin-image-remove"
                      aria-label="إزالة الصورة"
                      onClick={() => { setSelectedFile(null); setForm({...form, image: ''}); }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="admin-stars-label">الفيديو (تحميل ملف)</label>
                <label className="admin-image-upload-box">
                  <input
                    type="file"
                    className="admin-image-file-input"
                    onChange={e => { setSelectedVideoFile(e.target.files[0]); setForm({...form, videoUrl: ''}); }}
                    accept="video/*"
                  />
                  <span className="admin-image-upload-icon">▶</span>
                  <span className="admin-image-upload-text">تحميل فيديو</span>
                  <span className="admin-image-upload-hint">MP4, WebM, Ogg</span>
                </label>
                <label className="admin-stars-label" style={{ marginTop: '8px' }}>أو رابط الفيديو</label>
                <input
                  className="admin-stars-input"
                  value={form.videoUrl}
                  onChange={e => { setForm({...form, videoUrl: e.target.value}); setSelectedVideoFile(null); }}
                  placeholder="https://..."
                />
                {(videoPreview || form.videoUrl) && (
                  <div className="admin-video-preview" style={{ marginTop: '8px' }}>
                    {videoPreview ? (
                      <video src={videoPreview} controls />
                    ) : youtubeEmbed ? (
                      <iframe
                        src={youtubeEmbed}
                        title="Video preview"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video src={getFullVideoUrl(form.videoUrl)} controls />
                    )}
                    <button
                      type="button"
                      className="admin-image-remove"
                      aria-label="إزالة الفيديو"
                      onClick={() => { setSelectedVideoFile(null); setForm({...form, videoUrl: ''}); }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <div className="admin-stars-span">
                <label className="admin-stars-label">السيرة الذاتية بالعربية</label>
                <textarea className="admin-stars-input admin-stars-textarea" value={form.bioAr} onChange={e => setForm({...form, bioAr: e.target.value})} />
              </div>
              <div className="admin-stars-span">
                <label className="admin-stars-label">السيرة الذاتية بالإنجليزية</label>
                <textarea className="admin-stars-input admin-stars-textarea" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
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
