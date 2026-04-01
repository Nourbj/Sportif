import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminMatches = () => {
  const [matches, setMatches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const emptyForm = { homeTeam: '', awayTeam: '', homeTeamLogo: '', awayTeamLogo: '', date: '', competition: '', status: 'upcoming', homeScore: '', awayScore: '', venue: '' };
  const [form, setForm] = useState(emptyForm);

  const fetchMatches = () => axios.get('/api/matches').then(r => setMatches(r.data));
  useEffect(() => { fetchMatches(); }, []);

  const resetForm = () => { setForm(emptyForm); setEditing(null); setShowForm(false); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, homeScore: form.homeScore !== '' ? parseInt(form.homeScore) : null, awayScore: form.awayScore !== '' ? parseInt(form.awayScore) : null };
    if (editing) await axios.put(`/api/matches/${editing}`, data);
    else await axios.post('/api/matches', data);
    resetForm(); fetchMatches();
  };
  const handleEdit = (m) => {
    setForm({ homeTeam: m.homeTeam, awayTeam: m.awayTeam, homeTeamLogo: m.homeTeamLogo || '', awayTeamLogo: m.awayTeamLogo || '', date: m.date.slice(0, 16), competition: m.competition, status: m.status, homeScore: m.homeScore ?? '', awayScore: m.awayScore ?? '', venue: m.venue || '' });
    setEditing(m._id); setShowForm(true);
  };
  const handleDelete = async (id) => { if (window.confirm('حذف المباراة؟')) { await axios.delete(`/api/matches/${id}`); fetchMatches(); } };

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '6px', fontFamily: 'Cairo', fontSize: '0.9rem', outline: 'none' };
  const labelStyle = { display: 'block', fontWeight: 700, color: '#333', fontSize: '0.9rem', marginBottom: '4px' };
  const formatDate = (d) => new Date(d).toLocaleString('ar-TN');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900 }}>إدارة المباريات</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-red">+ إضافة مباراة</button>
      </div>
      {showForm && (
        <div style={{ background: 'white', padding: '28px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '24px', fontWeight: 800 }}>{editing ? 'تعديل مباراة' : 'إضافة مباراة'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>الفريق المضيف *</label><input style={inputStyle} value={form.homeTeam} onChange={e => setForm({...form, homeTeam: e.target.value})} required /></div>
              <div><label style={labelStyle}>الفريق الضيف *</label><input style={inputStyle} value={form.awayTeam} onChange={e => setForm({...form, awayTeam: e.target.value})} required /></div>
              <div><label style={labelStyle}>شعار المضيف (emoji)</label><input style={inputStyle} value={form.homeTeamLogo} onChange={e => setForm({...form, homeTeamLogo: e.target.value})} /></div>
              <div><label style={labelStyle}>شعار الضيف (emoji)</label><input style={inputStyle} value={form.awayTeamLogo} onChange={e => setForm({...form, awayTeamLogo: e.target.value})} /></div>
              <div><label style={labelStyle}>المسابقة *</label><input style={inputStyle} value={form.competition} onChange={e => setForm({...form, competition: e.target.value})} required /></div>
              <div><label style={labelStyle}>التاريخ والوقت *</label><input type="datetime-local" style={inputStyle} value={form.date} onChange={e => setForm({...form, date: e.target.value})} required /></div>
              <div><label style={labelStyle}>الحالة</label>
                <select style={inputStyle} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option value="upcoming">قادمة</option><option value="live">مباشر</option><option value="finished">انتهت</option>
                </select>
              </div>
              <div><label style={labelStyle}>الملعب</label><input style={inputStyle} value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} /></div>
              <div><label style={labelStyle}>نتيجة المضيف</label><input type="number" min="0" style={inputStyle} value={form.homeScore} onChange={e => setForm({...form, homeScore: e.target.value})} /></div>
              <div><label style={labelStyle}>نتيجة الضيف</label><input type="number" min="0" style={inputStyle} value={form.awayScore} onChange={e => setForm({...form, awayScore: e.target.value})} /></div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" className="btn-red">{editing ? 'حفظ' : 'إضافة'}</button>
              <button type="button" onClick={resetForm} className="btn-outline">إلغاء</button>
            </div>
          </form>
        </div>
      )}
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f9', borderBottom: '2px solid #eee' }}>
              {['المباراة', 'المسابقة', 'التاريخ', 'الحالة', 'النتيجة', 'الإجراءات'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#555', fontSize: '0.9rem' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matches.map(m => (
              <tr key={m._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700 }}>{m.homeTeam} vs {m.awayTeam}</td>
                <td style={{ padding: '12px 16px', color: '#666', fontSize: '0.9rem' }}>{m.competition}</td>
                <td style={{ padding: '12px 16px', color: '#666', fontSize: '0.85rem' }}>{formatDate(m.date)}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span className="badge" style={{ background: m.status === 'live' ? '#00aa44' : m.status === 'finished' ? '#555' : '#CC0000', color: 'white', fontSize: '0.75rem' }}>
                    {m.status === 'live' ? 'مباشر' : m.status === 'finished' ? 'انتهت' : 'قادمة'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#CC0000' }}>{m.homeScore !== null && m.awayScore !== null ? `${m.homeScore} - ${m.awayScore}` : '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(m)} style={{ padding: '6px 14px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Cairo', fontWeight: 700, fontSize: '0.8rem' }}>تعديل</button>
                    <button onClick={() => handleDelete(m._id)} style={{ padding: '6px 14px', background: '#CC0000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Cairo', fontWeight: 700, fontSize: '0.8rem' }}>حذف</button>
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

export default AdminMatches;
