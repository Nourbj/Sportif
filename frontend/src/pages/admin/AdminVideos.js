import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminVideos = () => {
  const [videos, setVideos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const empty = { titleAr: '', title: '', descriptionAr: '', description: '', url: '', thumbnail: '', category: 'highlights' };
  const [form, setForm] = useState(empty);

  const fetch = () => axios.get('/api/videos?limit=50').then(r => setVideos(r.data.videos));
  useEffect(() => { fetch(); }, []);

  const reset = () => { setForm(empty); setEditing(null); setShowForm(false); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await axios.put(`/api/videos/${editing}`, form);
    else await axios.post('/api/videos', form);
    reset(); fetch();
  };
  const handleEdit = (v) => { setForm({ titleAr: v.titleAr, title: v.title || '', descriptionAr: v.descriptionAr || '', description: v.description || '', url: v.url, thumbnail: v.thumbnail || '', category: v.category }); setEditing(v._id); setShowForm(true); };
  const handleDelete = async (id) => { if (window.confirm('حذف الفيديو؟')) { await axios.delete(`/api/videos/${id}`); fetch(); } };

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '6px', fontFamily: 'Cairo', fontSize: '0.9rem', outline: 'none' };
  const labelStyle = { display: 'block', fontWeight: 700, color: '#333', fontSize: '0.9rem', marginBottom: '4px' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900 }}>إدارة الفيديوهات</h1>
        <button onClick={() => { reset(); setShowForm(true); }} className="btn-red">+ إضافة فيديو</button>
      </div>
      {showForm && (
        <div style={{ background: 'white', padding: '28px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px', fontWeight: 800 }}>{editing ? 'تعديل فيديو' : 'إضافة فيديو'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>العنوان بالعربية *</label><input style={inputStyle} value={form.titleAr} onChange={e => setForm({...form, titleAr: e.target.value})} required /></div>
              <div><label style={labelStyle}>العنوان</label><input style={inputStyle} value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>رابط YouTube *</label><input style={inputStyle} value={form.url} onChange={e => setForm({...form, url: e.target.value})} required placeholder="https://www.youtube.com/embed/..." /></div>
              <div><label style={labelStyle}>رابط الصورة المصغرة</label><input style={inputStyle} value={form.thumbnail} onChange={e => setForm({...form, thumbnail: e.target.value})} /></div>
              <div><label style={labelStyle}>التصنيف</label>
                <select style={inputStyle} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {['highlights', 'interviews', 'analysis', 'other'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>الوصف بالعربية</label><textarea style={{...inputStyle, minHeight: '80px'}} value={form.descriptionAr} onChange={e => setForm({...form, descriptionAr: e.target.value})} /></div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" className="btn-red">{editing ? 'حفظ' : 'إضافة'}</button>
              <button type="button" onClick={reset} className="btn-outline">إلغاء</button>
            </div>
          </form>
        </div>
      )}
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#f9f9f9', borderBottom: '2px solid #eee' }}>
            {['الصورة', 'العنوان', 'التصنيف', 'المشاهدات', 'الإجراءات'].map(h => (
              <th key={h} style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#555', fontSize: '0.9rem' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {videos.map(v => (
              <tr key={v._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px 16px' }}><img src={v.thumbnail || `https://picsum.photos/seed/${v._id}/80/50`} alt="" style={{ width: '70px', height: '44px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                <td style={{ padding: '12px 16px', fontWeight: 600, maxWidth: '250px' }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.titleAr}</div></td>
                <td style={{ padding: '12px 16px' }}><span className="badge" style={{ background: '#ff6b00', color: 'white', fontSize: '0.75rem' }}>{v.category}</span></td>
                <td style={{ padding: '12px 16px', color: '#666' }}>👁 {v.views}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(v)} style={{ padding: '6px 14px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Cairo', fontWeight: 700, fontSize: '0.8rem' }}>تعديل</button>
                    <button onClick={() => handleDelete(v._id)} style={{ padding: '6px 14px', background: '#CC0000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Cairo', fontWeight: 700, fontSize: '0.8rem' }}>حذف</button>
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

export default AdminVideos;
