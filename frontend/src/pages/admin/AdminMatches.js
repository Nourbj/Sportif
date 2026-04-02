import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminMatches.css';

const AdminMatches = () => {
  const [matches, setMatches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const emptyForm = { homeTeam: '', awayTeam: '', homeTeamLogo: '', awayTeamLogo: '', date: '', competition: '', status: 'upcoming', homeScore: '', awayScore: '', venue: '' };
  const [form, setForm] = useState(emptyForm);

  const fetchMatches = () => axios.get(`/api/matches?limit=${pageSize}&page=${page}`).then(r => {
    setMatches(r.data.matches || []);
    setPages(r.data.pages || 1);
  });
  useEffect(() => { fetchMatches(); }, [page, pageSize]);

  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages, page]);

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

  const formatDate = (d) => new Date(d).toLocaleString('ar-TN');

  return (
    <div className="admin-matches">
      <div className="admin-matches-header">
        <h1 className="admin-matches-title">إدارة المباريات</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-red">+ إضافة مباراة</button>
      </div>
      {showForm && (
        <div className="admin-matches-form-card">
          <h3 className="admin-matches-form-title">{editing ? 'تعديل مباراة' : 'إضافة مباراة'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-matches-form-grid">
              <div>
                <label className="admin-matches-label">الفريق المضيف *</label>
                <input className="admin-matches-input" value={form.homeTeam} onChange={e => setForm({...form, homeTeam: e.target.value})} required />
              </div>
              <div>
                <label className="admin-matches-label">الفريق الضيف *</label>
                <input className="admin-matches-input" value={form.awayTeam} onChange={e => setForm({...form, awayTeam: e.target.value})} required />
              </div>
              <div>
                <label className="admin-matches-label">شعار المضيف (emoji)</label>
                <input className="admin-matches-input" value={form.homeTeamLogo} onChange={e => setForm({...form, homeTeamLogo: e.target.value})} />
              </div>
              <div>
                <label className="admin-matches-label">شعار الضيف (emoji)</label>
                <input className="admin-matches-input" value={form.awayTeamLogo} onChange={e => setForm({...form, awayTeamLogo: e.target.value})} />
              </div>
              <div>
                <label className="admin-matches-label">المسابقة *</label>
                <input className="admin-matches-input" value={form.competition} onChange={e => setForm({...form, competition: e.target.value})} required />
              </div>
              <div>
                <label className="admin-matches-label">التاريخ والوقت *</label>
                <input type="datetime-local" className="admin-matches-input" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
              </div>
              <div>
                <label className="admin-matches-label">الحالة</label>
                <select className="admin-matches-input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option value="upcoming">قادمة</option><option value="live">مباشر</option><option value="finished">انتهت</option>
                </select>
              </div>
              <div>
                <label className="admin-matches-label">الملعب</label>
                <input className="admin-matches-input" value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} />
              </div>
              <div>
                <label className="admin-matches-label">نتيجة المضيف</label>
                <input type="number" min="0" className="admin-matches-input" value={form.homeScore} onChange={e => setForm({...form, homeScore: e.target.value})} />
              </div>
              <div>
                <label className="admin-matches-label">نتيجة الضيف</label>
                <input type="number" min="0" className="admin-matches-input" value={form.awayScore} onChange={e => setForm({...form, awayScore: e.target.value})} />
              </div>
            </div>
            <div className="admin-matches-form-actions">
              <button type="submit" className="btn-red">{editing ? 'حفظ' : 'إضافة'}</button>
              <button type="button" onClick={resetForm} className="btn-outline">إلغاء</button>
            </div>
          </form>
        </div>
      )}
      <div className="admin-matches-table-card">
        <table className="admin-matches-table">
          <thead>
            <tr className="admin-matches-table-head">
              {['المباراة', 'المسابقة', 'التاريخ', 'الحالة', 'النتيجة', 'الإجراءات'].map(h => (
                <th key={h} className="admin-matches-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matches.map(m => (
              <tr key={m._id} className="admin-matches-tr">
                <td className="admin-matches-td admin-matches-strong">{m.homeTeam} vs {m.awayTeam}</td>
                <td className="admin-matches-td admin-matches-muted">{m.competition}</td>
                <td className="admin-matches-td admin-matches-date">{formatDate(m.date)}</td>
                <td className="admin-matches-td">
                  <span className="badge admin-matches-badge" style={{ background: m.status === 'live' ? '#00aa44' : m.status === 'finished' ? '#555' : '#CC0000' }}>
                    {m.status === 'live' ? 'مباشر' : m.status === 'finished' ? 'انتهت' : 'قادمة'}
                  </span>
                </td>
                <td className="admin-matches-td admin-matches-score">{m.homeScore !== null && m.awayScore !== null ? `${m.homeScore} - ${m.awayScore}` : '—'}</td>
                <td className="admin-matches-td">
                  <div className="admin-matches-actions">
                    <button onClick={() => handleEdit(m)} className="admin-matches-btn admin-matches-btn-edit">تعديل</button>
                    <button onClick={() => handleDelete(m._id)} className="admin-matches-btn admin-matches-btn-delete">حذف</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-matches-cards">
        {matches.map(m => (
          <div key={m._id} className="admin-matches-card">
            <div className="admin-matches-card-head">
              <div className="admin-matches-card-title">{m.homeTeam} vs {m.awayTeam}</div>
              <span className="badge admin-matches-badge" style={{ background: m.status === 'live' ? '#00aa44' : m.status === 'finished' ? '#555' : '#CC0000' }}>
                {m.status === 'live' ? 'مباشر' : m.status === 'finished' ? 'انتهت' : 'قادمة'}
              </span>
            </div>
            <div className="admin-matches-card-meta">
              <span className="admin-matches-muted">{m.competition}</span>
              <span className="admin-matches-date">{formatDate(m.date)}</span>
              <span className="admin-matches-score">{m.homeScore !== null && m.awayScore !== null ? `${m.homeScore} - ${m.awayScore}` : '—'}</span>
            </div>
            <div className="admin-matches-card-actions">
              <button onClick={() => handleEdit(m)} className="admin-matches-btn admin-matches-btn-edit">تعديل</button>
              <button onClick={() => handleDelete(m._id)} className="admin-matches-btn admin-matches-btn-delete">حذف</button>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-matches-pagination">
        <div className="admin-matches-page-size">
          <span>عدد الأسطر:</span>
          <select
            className="admin-matches-page-select"
            value={pageSize}
            onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}
          >
            {[5, 10, 20, 30].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <button
          className="admin-matches-page-btn"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          السابق
        </button>
        <div className="admin-matches-page-list">
          {Array.from({ length: pages }, (_, i) => i + 1).slice(0, 7).map(n => (
            <button
              key={n}
              className={`admin-matches-page-number${n === page ? ' is-active' : ''}`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          {pages > 7 && <span className="admin-matches-page-ellipsis">…</span>}
        </div>
        <span className="admin-matches-page-info">صفحة {page} من {pages}</span>
        <button
          className="admin-matches-page-btn"
          onClick={() => setPage(p => Math.min(pages, p + 1))}
          disabled={page === pages}
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default AdminMatches;
