import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import './AdminStars.css';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminMediaInput from '../../components/admin/AdminMediaInput';

const AdminStars = () => {
  const [stars, setStars] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [total, setTotal] = useState(0);
  const empty = { nameAr: '', name: '', sport: 'Football', position: '', age: '', nationality: '', nationalityAr: '', nationalityFlag: '', club: '', clubAr: '', image: '', bioAr: '', bio: '', videoUrl: '', featured: false };
  const [form, setForm] = useState(empty);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);

  const fetch = () => axios.get(`/api/stars?limit=${pageSize}&page=${page}`).then(r => {
    setStars(r.data.stars || []);
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
  return (
    <div className="admin-stars">
      <AdminPageHeader
        title="إدارة النجوم"
        subtitle={`إجمالي: ${total} نجم`}
        action={<button onClick={() => { reset(); setShowForm(true); }} className="btn-red">+ إضافة نجم</button>}
      />
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

export default AdminStars;
