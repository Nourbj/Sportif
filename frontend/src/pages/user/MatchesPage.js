import React, { useState, useEffect } from 'react';
import axios from 'axios';

const formatTime = (d) => new Date(d).toLocaleTimeString('ar-TN', { hour: '2-digit', minute: '2-digit' });
const formatDate = (d) => new Date(d).toLocaleDateString('ar-TN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/matches${status ? `?status=${status}` : ''}`)
      .then(r => setMatches(r.data))
      .finally(() => setLoading(false));
  }, [status]);

  const statuses = [{ val: '', label: 'الكل' }, { val: 'live', label: '🔴 مباشر' }, { val: 'upcoming', label: '🕐 قادمة' }, { val: 'finished', label: '✅ منتهية' }];

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 className="section-title">مباريات اليوم</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        {statuses.map(s => (
          <button key={s.val} onClick={() => setStatus(s.val)}
            style={{ padding: '8px 20px', borderRadius: '20px', border: `2px solid ${status === s.val ? '#CC0000' : '#ddd'}`, background: status === s.val ? '#CC0000' : 'white', color: status === s.val ? 'white' : '#555', fontFamily: 'Cairo', fontWeight: 700, cursor: 'pointer' }}>
            {s.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#CC0000', fontSize: '1.5rem' }}>⏳ جار التحميل...</div>
      ) : matches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#f9f9f9', borderRadius: '12px', color: '#888' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚽</div>
          <p style={{ fontSize: '1.1rem' }}>لا توجد مباريات</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {matches.map(m => (
            <div key={m._id} className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: '#CC0000', fontWeight: 700, background: '#fff5f5', padding: '4px 12px', borderRadius: '12px' }}>{m.competition}</span>
                {m.status === 'live' && <span className="badge badge-live">🔴 مباشر الآن</span>}
                {m.status === 'finished' && <span style={{ fontSize: '0.8rem', color: '#666', background: '#f0f0f0', padding: '4px 12px', borderRadius: '12px' }}>انتهت المباراة</span>}
                {m.status === 'upcoming' && <span style={{ fontSize: '0.85rem', color: '#555' }}>📅 {formatDate(m.date)} — {formatTime(m.date)}</span>}
                {m.venue && <span style={{ fontSize: '0.82rem', color: '#aaa', marginRight: 'auto' }}>📍 {m.venue}</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '500px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{m.homeTeamLogo || '⚽'}</div>
                  <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#111' }}>{m.homeTeam}</div>
                </div>
                <div style={{ textAlign: 'center', padding: '0 30px' }}>
                  {m.homeScore !== null && m.awayScore !== null ? (
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#CC0000', lineHeight: 1 }}>{m.homeScore} - {m.awayScore}</div>
                  ) : (
                    <div style={{ fontSize: '1.3rem', color: '#bbb', fontWeight: 700 }}>VS</div>
                  )}
                  {m.status === 'upcoming' && <div style={{ fontSize: '0.9rem', color: '#CC0000', fontWeight: 700, marginTop: '6px' }}>{formatTime(m.date)}</div>}
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{m.awayTeamLogo || '⚽'}</div>
                  <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#111' }}>{m.awayTeam}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchesPage;
