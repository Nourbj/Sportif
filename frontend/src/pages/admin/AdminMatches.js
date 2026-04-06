import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import { getFullVideoUrl, getYouTubeEmbedUrl } from '../../utils/videoUtils';
import './AdminMatches.css';

const AdminMatches = () => {
  const [matches, setMatches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const emptyForm = { homeTeam: '', awayTeam: '', homeTeamLogo: '', awayTeamLogo: '', date: '', competition: '', status: 'upcoming', homeScore: '', awayScore: '', venue: '', videoUrl: '' };
  const [form, setForm] = useState(emptyForm);
  const [homeFile, setHomeFile] = useState(null);
  const [awayFile, setAwayFile] = useState(null);
  const [homePreview, setHomePreview] = useState('');
  const [awayPreview, setAwayPreview] = useState('');
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');

  const fetchMatches = () => axios.get(`/api/matches?limit=${pageSize}&page=${page}`).then(r => {
    setMatches(r.data.matches || []);
    setPages(r.data.pages || 1);
  });
  useEffect(() => { fetchMatches(); }, [page, pageSize]);

  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages, page]);

  useEffect(() => {
    if (!homeFile) { setHomePreview(''); return; }
    const url = URL.createObjectURL(homeFile);
    setHomePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [homeFile]);

  useEffect(() => {
    if (!awayFile) { setAwayPreview(''); return; }
    const url = URL.createObjectURL(awayFile);
    setAwayPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [awayFile]);

  useEffect(() => {
    if (!selectedVideoFile) { setVideoPreview(''); return; }
    const url = URL.createObjectURL(selectedVideoFile);
    setVideoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedVideoFile]);

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

  const formatDate = (d) => new Date(d).toLocaleString('ar-TN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  const youtubeEmbed = getYouTubeEmbedUrl(form.videoUrl);

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
                <label className="admin-matches-label">شعار المضيف (تحميل ملف)</label>
                <label className="admin-image-upload-box">
                  <input
                    type="file"
                    className="admin-image-file-input"
                    onChange={e => { setHomeFile(e.target.files[0]); setForm({...form, homeTeamLogo: ''}); }}
                    accept="image/*"
                  />
                  <span className="admin-image-upload-icon">+</span>
                  <span className="admin-image-upload-text">تحميل صورة</span>
                </label>
                <label className="admin-matches-label" style={{ marginTop: '8px' }}>أو رابط شعار المضيف</label>
                <input
                  className="admin-matches-input"
                  value={form.homeTeamLogo}
                  onChange={e => { setForm({...form, homeTeamLogo: e.target.value}); setHomeFile(null); }}
                  placeholder="https://..."
                />
                {(homePreview || form.homeTeamLogo) && (
                  <div className="admin-image-preview" style={{ marginTop: '8px' }}>
                    <img src={homePreview || getFullImageUrl(form.homeTeamLogo)} alt="" />
                    <button
                      type="button"
                      className="admin-image-remove"
                      aria-label="إزالة الصورة"
                      onClick={() => { setHomeFile(null); setForm({...form, homeTeamLogo: ''}); }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="admin-matches-label">شعار الضيف (تحميل ملف)</label>
                <label className="admin-image-upload-box">
                  <input
                    type="file"
                    className="admin-image-file-input"
                    onChange={e => { setAwayFile(e.target.files[0]); setForm({...form, awayTeamLogo: ''}); }}
                    accept="image/*"
                  />
                  <span className="admin-image-upload-icon">+</span>
                  <span className="admin-image-upload-text">تحميل صورة</span>
                </label>
                <label className="admin-matches-label" style={{ marginTop: '8px' }}>أو رابط شعار الضيف</label>
                <input
                  className="admin-matches-input"
                  value={form.awayTeamLogo}
                  onChange={e => { setForm({...form, awayTeamLogo: e.target.value}); setAwayFile(null); }}
                  placeholder="https://..."
                />
                {(awayPreview || form.awayTeamLogo) && (
                  <div className="admin-image-preview" style={{ marginTop: '8px' }}>
                    <img src={awayPreview || getFullImageUrl(form.awayTeamLogo)} alt="" />
                    <button
                      type="button"
                      className="admin-image-remove"
                      aria-label="إزالة الصورة"
                      onClick={() => { setAwayFile(null); setForm({...form, awayTeamLogo: ''}); }}
                    >
                      ×
                    </button>
                  </div>
                )}
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
                <label className="admin-matches-label">الفيديو (تحميل ملف)</label>
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
                <label className="admin-matches-label" style={{ marginTop: '8px' }}>أو رابط الفيديو</label>
                <input
                  className="admin-matches-input"
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
              {['المباراة', 'المسابقة', 'التاريخ', 'الحالة', 'النتيجة', 'فيديو', 'الإجراءات'].map(h => (
                <th key={h} className="admin-matches-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matches.map(m => (
              <tr key={m._id} className="admin-matches-tr">
                <td className="admin-matches-td admin-matches-strong">
                  {m.homeTeamLogo && <img src={getFullImageUrl(m.homeTeamLogo)} alt="" style={{width: '20px', marginRight: '5px'}} />}
                  {m.homeTeam} vs {m.awayTeam}
                  {m.awayTeamLogo && <img src={getFullImageUrl(m.awayTeamLogo)} alt="" style={{width: '20px', marginLeft: '5px'}} />}
                </td>
                <td className="admin-matches-td admin-matches-muted">{m.competition}</td>
                <td className="admin-matches-td admin-matches-date">{formatDate(m.date)}</td>
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
              <span className="admin-matches-date">{formatDate(m.date)}</span>
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
