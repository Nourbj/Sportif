import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const formatDate = (d) => new Date(d).toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' });
const formatTime = (d) => new Date(d).toLocaleTimeString('ar-TN', { hour: '2-digit', minute: '2-digit' });

const Home = () => {
  const [news, setNews] = useState([]);
  const [matches, setMatches] = useState([]);
  const [videos, setVideos] = useState([]);
  const [stars, setStars] = useState([]);

  useEffect(() => {
    axios.get('/api/news?limit=6').then(r => setNews(r.data.news)).catch(() => {});
    axios.get('/api/matches/today').then(r => setMatches(r.data)).catch(() => {});
    axios.get('/api/videos?limit=4').then(r => setVideos(r.data.videos)).catch(() => {});
    axios.get('/api/stars?featured=true').then(r => setStars(r.data)).catch(() => {});
  }, []);

  const featured = news.filter(n => n.featured).slice(0, 3);
  const restNews = news.filter(n => !n.featured).slice(0, 4);

  return (
    <div>
      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #CC0000 0%, #880000 100%)', color: 'white', padding: '40px 0', marginBottom: '40px' }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img src="/images/logo.jpg" alt="Logo" style={{ height: '80px', width: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)' }} />
            </div>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto', lineHeight: 1.8 }}>
              مصدرك الرئيسي لأحدث الأخبار والتغطيات الرياضية، مع متابعة مستمرة وتحليلات دقيقة
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Featured News */}
        {featured.length > 0 && (
          <section style={{ marginBottom: '50px' }}>
            <h2 className="section-title">أبرز الأخبار</h2>
            <div style={{ display: 'grid', gridTemplateColumns: featured.length > 1 ? '2fr 1fr' : '1fr', gap: '20px' }}>
              {featured[0] && (
                <Link to={`/news/${featured[0]._id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ position: 'relative', height: '350px', overflow: 'hidden' }}>
                    <img src={featured[0].image || `https://picsum.photos/seed/${featured[0]._id}/800/450`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', padding: '30px 20px 20px', color: 'white' }}>
                      <span className="badge badge-red" style={{ marginBottom: '8px', display: 'inline-block' }}>{featured[0].category}</span>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.4 }}>{featured[0].titleAr}</h3>
                      <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '6px' }}>👁 {featured[0].views} • {formatDate(featured[0].createdAt)}</p>
                    </div>
                  </div>
                </Link>
              )}
              {featured.length > 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {featured.slice(1, 3).map(n => (
                    <Link key={n._id} to={`/news/${n._id}`} style={{ textDecoration: 'none' }}>
                      <div className="card" style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                        <img src={n.image || `https://picsum.photos/seed/${n._id}/400/200`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', padding: '20px 15px 12px', color: 'white' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.4 }}>{n.titleAr}</h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Today's Matches */}
        <section style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>مباريات اليوم</h2>
            <Link to="/matches" style={{ color: '#CC0000', fontWeight: 700, fontSize: '0.9rem' }}>عرض الكل →</Link>
          </div>
          {matches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999', background: '#f5f5f5', borderRadius: '8px' }}>لا توجد مباريات اليوم</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {matches.map(m => (
                <div key={m._id} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#CC0000', fontWeight: 700 }}>{m.competition}</span>
                    {m.status === 'live' ? <span className="badge badge-live">🔴 مباشر</span> :
                     m.status === 'finished' ? <span className="badge" style={{ background: '#555', color: 'white' }}>انتهت</span> :
                     <span style={{ fontSize: '0.85rem', color: '#666' }}>{formatTime(m.date)}</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{m.homeTeamLogo || '⚽'}</div>
                      <div style={{ fontWeight: 800, fontSize: '1rem' }}>{m.homeTeam}</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '8px 16px' }}>
                      {m.homeScore !== null && m.awayScore !== null ? (
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#CC0000' }}>{m.homeScore} - {m.awayScore}</div>
                      ) : <div style={{ fontSize: '1.2rem', color: '#999' }}>vs</div>}
                    </div>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{m.awayTeamLogo || '⚽'}</div>
                      <div style={{ fontWeight: 800, fontSize: '1rem' }}>{m.awayTeam}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Latest News Grid */}
        {restNews.length > 0 && (
          <section style={{ marginBottom: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 className="section-title" style={{ margin: 0 }}>آخر الأخبار</h2>
              <Link to="/news" style={{ color: '#CC0000', fontWeight: 700, fontSize: '0.9rem' }}>عرض الكل →</Link>
            </div>
            <div className="grid-4">
              {restNews.map(n => (
                <Link key={n._id} to={`/news/${n._id}`} style={{ textDecoration: 'none' }}>
                  <div className="card">
                    <img src={n.image || `https://picsum.photos/seed/${n._id}/400/220`} alt="" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                    <div style={{ padding: '16px' }}>
                      <span className="badge badge-red" style={{ fontSize: '0.7rem', marginBottom: '8px', display: 'inline-block' }}>{n.category}</span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.5, color: '#111', marginBottom: '8px' }}>{n.titleAr}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#999' }}>{formatDate(n.createdAt)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Videos Section */}
        {videos.length > 0 && (
          <section style={{ marginBottom: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 className="section-title" style={{ margin: 0 }}>فيديوهات</h2>
              <Link to="/videos" style={{ color: '#CC0000', fontWeight: 700, fontSize: '0.9rem' }}>عرض الكل →</Link>
            </div>
            <div className="grid-4">
              {videos.map(v => (
                <Link key={v._id} to={`/videos/${v._id}`} style={{ textDecoration: 'none' }}>
                  <div className="card">
                    <div style={{ position: 'relative' }}>
                      <img src={v.thumbnail || `https://picsum.photos/seed/${v._id}/400/225`} alt="" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                        <div style={{ width: '44px', height: '44px', background: '#CC0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>▶</div>
                      </div>
                    </div>
                    <div style={{ padding: '12px' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111', lineHeight: 1.5 }}>{v.titleAr}</h4>
                      <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '4px' }}>👁 {v.views}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Stars */}
        {stars.length > 0 && (
          <section style={{ marginBottom: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 className="section-title" style={{ margin: 0 }}>نجوم</h2>
              <Link to="/stars" style={{ color: '#CC0000', fontWeight: 700, fontSize: '0.9rem' }}>عرض الكل →</Link>
            </div>
            <div className="grid-4">
              {stars.map(s => (
                <Link key={s._id} to={`/stars/${s._id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
                    <img src={s.image || `https://picsum.photos/seed/${s._id}/200/200`} alt="" style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #CC0000', marginBottom: '12px' }} />
                    <h4 style={{ fontWeight: 800, color: '#111' }}>{s.nameAr}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#CC0000', fontWeight: 600 }}>{s.sport}</p>
                    <p style={{ fontSize: '0.8rem', color: '#999' }}>{s.nationalityAr || s.nationality}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
