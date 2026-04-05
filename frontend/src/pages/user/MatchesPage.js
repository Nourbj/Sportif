import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import './MatchesPage.css';

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
    <div className="container matches-page">
      <h1 className="section-title">مباريات اليوم</h1>
      <div className="matches-filters">
        {statuses.map(s => (
          <button key={s.val} onClick={() => setStatus(s.val)}
            className={`matches-filter-btn${status === s.val ? ' is-active' : ''}`}>
            {s.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="matches-loading">⏳ جار التحميل...</div>
      ) : matches.length === 0 ? (
        <div className="matches-empty">
          <div className="matches-empty-icon">⚽</div>
          <p className="matches-empty-text">لا توجد مباريات</p>
        </div>
      ) : (
        <div className="matches-list">
          {matches.map(m => (
            <div key={m._id} className="card matches-card">
              <div className="matches-card-top">
                <span className="matches-competition">{m.competition}</span>
                {m.status === 'live' && <span className="badge badge-live">🔴 مباشر الآن</span>}
                {m.status === 'finished' && <span className="matches-status-finished">انتهت المباراة</span>}
                {m.status === 'upcoming' && <span className="matches-status-upcoming">📅 {formatDate(m.date)} — {formatTime(m.date)}</span>}
                {m.venue && <span className="matches-venue">📍 {m.venue}</span>}
              </div>
              <div className="matches-score-row">
                <div className="matches-team">
                  <div className="matches-team-logo">
                    {m.homeTeamLogo && !m.homeTeamLogo.startsWith('http') && !m.homeTeamLogo.startsWith('/') ? m.homeTeamLogo : (
                      <img src={getFullImageUrl(m.homeTeamLogo) || '⚽'} alt="" style={{width: '32px'}} />
                    )}
                  </div>
                  <div className="matches-team-name">{m.homeTeam}</div>
                </div>
                <div className="matches-score">
                  {m.homeScore !== null && m.awayScore !== null ? (
                    <div className="matches-score-value">{m.homeScore} - {m.awayScore}</div>
                  ) : (
                    <div className="matches-vs">VS</div>
                  )}
                  {m.status === 'upcoming' && <div className="matches-time">{formatTime(m.date)}</div>}
                </div>
                <div className="matches-team">
                  <div className="matches-team-logo">
                    {m.awayTeamLogo && !m.awayTeamLogo.startsWith('http') && !m.awayTeamLogo.startsWith('/') ? m.awayTeamLogo : (
                      <img src={getFullImageUrl(m.awayTeamLogo) || '⚽'} alt="" style={{width: '32px'}} />
                    )}
                  </div>
                  <div className="matches-team-name">{m.awayTeam}</div>
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
