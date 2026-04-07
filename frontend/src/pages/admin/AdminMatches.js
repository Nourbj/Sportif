import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import { formatDateAr, formatTimeAr } from '../../utils/timeUtils';
import './AdminMatches.css';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminMediaInput from '../../components/admin/AdminMediaInput';

const AdminMatches = () => {
  const [matches, setMatches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const emptyForm = { homeTeam: '', awayTeam: '', homeTeamLogo: '', awayTeamLogo: '', date: '', competition: '', status: 'upcoming', homeScore: '', awayScore: '', venue: '', videoUrl: '' };
  const [form, setForm] = useState(emptyForm);
  const [homeFile, setHomeFile] = useState(null);
  const [awayFile, setAwayFile] = useState(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);

  const fetchMatches = () => axios.get(`/api/matches?limit=${pageSize}&page=${page}`).then(r => {
    setMatches(r.data.matches || []);
    setPages(r.data.pages || 1);
    setTotal(r.data.total || 0);
  });
  useEffect(() => { fetchMatches(); }, [page, pageSize]);

  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages, page]);

  const resetForm = () => { 
    setForm(emptyForm); 
    setHomeFile(null);
    setAwayFile(null);
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
    
    if (homeFile) formData.append('homeTeamLogo', homeFile);
    if (awayFile) formData.append('awayTeamLogo', awayFile);
    if (selectedVideoFile) formData.append('video', selectedVideoFile);

    if (editing) await axios.put(`/api/matches/${editing}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    else await axios.post('/api/matches', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    
    resetForm(); fetchMatches();
  };
  const handleEdit = (m) => {
    setForm({ homeTeam: m.homeTeam, awayTeam: m.awayTeam, homeTeamLogo: m.homeTeamLogo || '', awayTeamLogo: m.awayTeamLogo || '', date: m.date.slice(0, 16), competition: m.competition, status: m.status, homeScore: m.homeScore ?? '', awayScore: m.awayScore ?? '', venue: m.venue || '', videoUrl: m.videoUrl || '' });
    setHomeFile(null);
    setAwayFile(null);
    setSelectedVideoFile(null);
    setEditing(m._id); setShowForm(true);
  };
  const handleDelete = async (id) => { if (window.confirm('حذف المباراة؟')) { await axios.delete(`/api/matches/${id}`); fetchMatches(); } };

  return (
    <div className="admin-matches">
      <AdminPageHeader
        title="إدارة المباريات"
        subtitle={`إجمالي: ${total} مباراة`}
        action={<button onClick={() => { resetForm(); setShowForm(true); }} className="btn-red">+ إضافة مباراة</button>}
      />
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
                <AdminMediaInput
                  label="شعار المضيف"
                  type="image"
                  file={homeFile}
                  setFile={setHomeFile}
                  value={form.homeTeamLogo}
                  onValueChange={(val) => setForm({ ...form, homeTeamLogo: val })}
                  hint="PNG, JPG, WebP"
                />
              </div>
              <div>
                <AdminMediaInput
                  label="شعار الضيف"
                  type="image"
                  file={awayFile}
                  setFile={setAwayFile}
                  value={form.awayTeamLogo}
                  onValueChange={(val) => setForm({ ...form, awayTeamLogo: val })}
                  hint="PNG, JPG, WebP"
                />
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
              {['الشعارات', 'المباراة', 'المسابقة', 'التاريخ', 'الحالة', 'النتيجة', 'فيديو', 'الإجراءات'].map(h => (
                <th key={h} className="admin-matches-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matches.map(m => (
              <tr key={m._id} className="admin-matches-tr">
                <td className="admin-matches-td admin-matches-logos">
                  {m.homeTeamLogo && <img src={getFullImageUrl(m.homeTeamLogo)} alt="" className="admin-matches-logo" />}
                  <span className="admin-matches-vs">vs</span>
                  {m.awayTeamLogo && <img src={getFullImageUrl(m.awayTeamLogo)} alt="" className="admin-matches-logo" />}
                </td>
                <td className="admin-matches-td admin-matches-strong">
                  {m.homeTeam} vs {m.awayTeam}
                </td>
                <td className="admin-matches-td admin-matches-muted">{m.competition}</td>
                <td className="admin-matches-td admin-matches-date">
                  <div>{formatDateAr(m.date)}</div>
                  <div>{formatTimeAr(m.date)}</div>
                </td>
                <td className="admin-matches-td">
                  <span className="badge admin-matches-badge" style={{ background: m.status === 'live' ? '#00aa44' : m.status === 'finished' ? '#555' : '#CC0000' }}>
                    {m.status === 'live' ? 'مباشر' : m.status === 'finished' ? 'انتهت' : 'قادمة'}
                  </span>
                </td>
                <td className="admin-matches-td admin-matches-score">{m.homeScore !== null && m.awayScore !== null ? `${m.homeScore} - ${m.awayScore}` : '—'}</td>
                <td className="admin-matches-td">{m.videoUrl ? '📹' : '—'}</td>
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
              <div className="admin-matches-card-title">
                {m.homeTeamLogo && <img src={getFullImageUrl(m.homeTeamLogo)} alt="" style={{width: '20px', marginRight: '5px'}} />}
                {m.homeTeam} vs {m.awayTeam}
                {m.awayTeamLogo && <img src={getFullImageUrl(m.awayTeamLogo)} alt="" style={{width: '20px', marginLeft: '5px'}} />}
              </div>
              <span className="badge admin-matches-badge" style={{ background: m.status === 'live' ? '#00aa44' : m.status === 'finished' ? '#555' : '#CC0000' }}>
                {m.status === 'live' ? 'مباشر' : m.status === 'finished' ? 'انتهت' : 'قادمة'}
              </span>
            </div>
            <div className="admin-matches-card-meta">
              <span className="admin-matches-muted">{m.competition}</span>
              <span className="admin-matches-date">{formatDateAr(m.date)} — {formatTimeAr(m.date)}</span>
              {m.videoUrl && <span className="admin-matches-video-badge">📹 فيديو</span>}
              <span className="admin-matches-score">{m.homeScore !== null && m.awayScore !== null ? `${m.homeScore} - ${m.awayScore}` : '—'}</span>
            </div>
            <div className="admin-matches-card-actions">
              <button onClick={() => handleEdit(m)} className="admin-matches-btn admin-matches-btn-edit">تعديل</button>
              <button onClick={() => handleDelete(m._id)} className="admin-matches-btn admin-matches-btn-delete">حذف</button>
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

export default AdminMatches;
