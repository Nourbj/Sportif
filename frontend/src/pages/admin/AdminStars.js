import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminStars = () => {
  const [stars, setStars] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const empty = { nameAr: '', name: '', sport: 'Football', nationality: '', nationalityAr: '', club: '', clubAr: '', image: '', bioAr: '', bio: '', featured: false };
  const [form, setForm] = useState(empty);

  const fetch = () => axios.get('/api/stars').then(r => setStars(r.data));
  useEffect(() => { fetch(); }, []);

  const reset = () => { setForm(empty); setEditing(null); setShowForm(false); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await axios.put(`/api/stars/${editing}`, form);
    else await axios.post('/api/stars', form);
    reset(); fetch();
  };
  const handleEdit = (s) => { setForm({ nameAr: s.nameAr, name: s.name || '', sport: s.sport, nationality: s.nationality, nationalityAr: s.nationalityAr || '', club: s.club || '', clubAr: s.clubAr || '', image: s.image || '', bioAr: s.bioAr || '', bio: s.bio || '', featured: s.featured }); setEditing(s._id); setShowForm(true); };
  const handleDelete = async (id) => { if (window.confirm('حذف النجم؟')) { await axios.delete(`/api/stars/${id}`); fetch(); } };

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '6px', fontFamily: 'Cairo', fontSize: '0.9rem', outline: 'none' };
  const labelStyle = { display: 'block', fontWeight: 700, color: '#333', fontSize: '0.9rem', marginBottom: '4px' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900 }}>إدارة النجوم</h1>
        <button onClick={() => { reset(); setShowForm(true); }} className="btn-red">+ إضافة نجم</button>
      </div>
      {showForm && (
        <div style={{ background: 'white', padding: '28px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px', fontWeight: 800 }}>{editing ? 'تعديل' : 'إضافة نجم'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>الاسم بالعربية *</label><input style={inputStyle} value={form.nameAr} onChange={e => setForm({...form, nameAr: e.target.value})} required /></div>
              <div><label style={labelStyle}>الاسم بالإنجليزية</label><input style={inputStyle} value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div><label style={labelStyle}>الرياضة *</label>
                <select style={inputStyle} value={form.sport} onChange={e => setForm({...form, sport: e.target.value})}>
                  {['Football', 'Tennis', 'Basketball', 'Athletics', 'Swimming', 'Other'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>الجنسية</label><input style={inputStyle} value={form.nationalityAr} onChange={e => setForm({...form, nationalityAr: e.target.value})} /></div>
              <div><label style={labelStyle}>النادي بالعربية</label><input style={inputStyle} value={form.clubAr} onChange={e => setForm({...form, clubAr: e.target.value})} /></div>
              <div><label style={labelStyle}>رابط الصورة</label><input style={inputStyle} value={form.image} onChange={e => setForm({...form, image: e.target.value})} /></div>
              <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>السيرة الذاتية بالعربية</label><textarea style={{...inputStyle, minHeight: '80px'}} value={form.bioAr} onChange={e => setForm({...form, bioAr: e.target.value})} /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} />
                <label htmlFor="featured" style={{ fontWeight: 700, cursor: 'pointer' }}>نجم مميز</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" className="btn-red">{editing ? 'حفظ' : 'إضافة'}</button>
              <button type="button" onClick={reset} className="btn-outline">إلغاء</button>
            </div>
          </form>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {stars.map(s => (
          <div key={s._id} style={{ background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <img src={s.image || `https://picsum.photos/seed/${s._id}/100/100`} alt="" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #CC0000', marginBottom: '12px' }} />
            <h4 style={{ fontWeight: 800, marginBottom: '4px' }}>{s.nameAr}</h4>
            <p style={{ color: '#CC0000', fontSize: '0.85rem', marginBottom: '12px' }}>{s.sport}</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button onClick={() => handleEdit(s)} style={{ padding: '5px 12px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Cairo', fontWeight: 700, fontSize: '0.78rem' }}>تعديل</button>
              <button onClick={() => handleDelete(s._id)} style={{ padding: '5px 12px', background: '#CC0000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Cairo', fontWeight: 700, fontSize: '0.78rem' }}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStars;
