import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '6px', fontFamily: 'Cairo', fontSize: '0.9rem', outline: 'none', marginTop: '4px' };
  const labelStyle = { display: 'block', fontWeight: 700, color: '#333', fontSize: '0.9rem', marginBottom: '4px' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900 }}>إدارة الأخبار</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-red">+ إضافة خبر</button>
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '28px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '24px', fontWeight: 800 }}>{editing ? 'تعديل الخبر' : 'إضافة خبر جديد'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>العنوان بالعربية *</label><input style={inputStyle} value={form.titleAr} onChange={e => setForm({...form, titleAr: e.target.value})} required /></div>
              <div><label style={labelStyle}>العنوان بالفرنسية/الإنجليزية</label><input style={inputStyle} value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>المحتوى بالعربية *</label><textarea style={{...inputStyle, minHeight: '120px', resize: 'vertical'}} value={form.contentAr} onChange={e => setForm({...form, contentAr: e.target.value})} required /></div>
              <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>المحتوى بالفرنسية/الإنجليزية</label><textarea style={{...inputStyle, minHeight: '100px', resize: 'vertical'}} value={form.content} onChange={e => setForm({...form, content: e.target.value})} /></div>
              <div><label style={labelStyle}>التصنيف</label>
                <select style={inputStyle} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {['football','basketball','tennis','local','international','other'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>رابط الصورة</label><input style={inputStyle} value={form.image} onChange={e => setForm({...form, image: e.target.value})} /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} />
                <label htmlFor="featured" style={{ fontWeight: 700, cursor: 'pointer' }}>خبر مميز</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" className="btn-red">{editing ? 'حفظ التعديلات' : 'نشر الخبر'}</button>
              <button type="button" onClick={resetForm} className="btn-outline">إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div style={{ textAlign: 'center', padding: '40px', color: '#CC0000' }}>⏳ جار التحميل...</div> : (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', borderBottom: '2px solid #eee' }}>
                {['الصورة', 'العنوان', 'التصنيف', 'المشاهدات', 'مميز', 'الإجراءات'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#555', fontSize: '0.9rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {news.map(n => (
                <tr key={n._id} style={{ borderBottom: '1px solid #f0f0f0' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafafa'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                  <td style={{ padding: '12px 16px' }}><img src={n.image || `https://picsum.photos/seed/${n._id}/60/40`} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, maxWidth: '250px' }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.titleAr}</div></td>
                  <td style={{ padding: '12px 16px' }}><span className="badge badge-red" style={{ fontSize: '0.75rem' }}>{n.category}</span></td>
                  <td style={{ padding: '12px 16px', color: '#666' }}>👁 {n.views}</td>
                  <td style={{ padding: '12px 16px' }}>{n.featured ? '⭐' : '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEdit(n)} style={{ padding: '6px 14px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Cairo', fontWeight: 700, fontSize: '0.8rem' }}>تعديل</button>
                      <button onClick={() => handleDelete(n._id)} style={{ padding: '6px 14px', background: '#CC0000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Cairo', fontWeight: 700, fontSize: '0.8rem' }}>حذف</button>
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
