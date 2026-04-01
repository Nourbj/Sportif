import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '6px', fontFamily: 'Cairo', fontSize: '0.9rem', outline: 'none' };
  const labelStyle = { display: 'block', fontWeight: 700, color: '#333', fontSize: '0.9rem', marginBottom: '4px' };
  const formatDate = (d) => new Date(d).toLocaleDateString('ar-TN');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900 }}>إدارة المقالات</h1>
        <button onClick={() => { reset(); setShowForm(true); }} className="btn-red">+ إضافة مقال</button>
      </div>
      {showForm && (
        <div style={{ background: 'white', padding: '28px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px', fontWeight: 800 }}>{editing ? 'تعديل مقال' : 'إضافة مقال'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>العنوان بالعربية *</label><input style={inputStyle} value={form.titleAr} onChange={e => setForm({...form, titleAr: e.target.value})} required /></div>
              <div><label style={labelStyle}>النوع</label>
                <select style={inputStyle} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="analysis">تحليل</option><option value="opinion">رأي</option><option value="report">تقرير</option>
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>المحتوى بالعربية *</label><textarea style={{...inputStyle, minHeight: '150px', resize: 'vertical'}} value={form.contentAr} onChange={e => setForm({...form, contentAr: e.target.value})} required /></div>
              <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>رابط الصورة</label><input style={inputStyle} value={form.image} onChange={e => setForm({...form, image: e.target.value})} /></div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" className="btn-red">{editing ? 'حفظ' : 'نشر'}</button>
              <button type="button" onClick={reset} className="btn-outline">إلغاء</button>
            </div>
          </form>
        </div>
      )}
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#f9f9f9', borderBottom: '2px solid #eee' }}>
            {['الصورة', 'العنوان', 'النوع', 'القراءات', 'التاريخ', 'الإجراءات'].map(h => (
              <th key={h} style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#555', fontSize: '0.9rem' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {articles.map(a => (
              <tr key={a._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px 16px' }}><img src={a.image || `https://picsum.photos/seed/${a._id}/70/44`} alt="" style={{ width: '70px', height: '44px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                <td style={{ padding: '12px 16px', fontWeight: 600, maxWidth: '240px' }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.titleAr}</div></td>
                <td style={{ padding: '12px 16px' }}><span className="badge" style={{ background: a.type === 'analysis' ? '#1a73e8' : a.type === 'opinion' ? '#e8a01a' : '#1aae6f', color: 'white', fontSize: '0.72rem' }}>{a.type === 'analysis' ? 'تحليل' : a.type === 'opinion' ? 'رأي' : 'تقرير'}</span></td>
                <td style={{ padding: '12px 16px', color: '#666' }}>👁 {a.views}</td>
                <td style={{ padding: '12px 16px', color: '#888', fontSize: '0.85rem' }}>{formatDate(a.createdAt)}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(a)} style={{ padding: '6px 14px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Cairo', fontWeight: 700, fontSize: '0.8rem' }}>تعديل</button>
                    <button onClick={() => handleDelete(a._id)} style={{ padding: '6px 14px', background: '#CC0000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Cairo', fontWeight: 700, fontSize: '0.8rem' }}>حذف</button>
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
