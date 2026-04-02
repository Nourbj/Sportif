import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
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
      <div className="home-hero">
        <div className="container">
          <div className="home-hero-center">
            <div className="home-hero-logo-wrap">
              <img src="/images/logo.jpg" alt="Logo" className="home-hero-logo" />
            </div>
            <p className="home-hero-text">
              مصدرك الرئيسي لأحدث الأخبار والتغطيات الرياضية، مع متابعة مستمرة وتحليلات دقيقة
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Featured News */}
        {featured.length > 0 && (
          <section className="home-section">
            <h2 className="section-title">أبرز الأخبار</h2>
            <div className={`featured-grid ${featured.length > 1 ? 'featured-grid-split' : 'featured-grid-single'}`}>
              {featured[0] && (
                <Link to={`/news/${featured[0]._id}`} className="featured-main">
                  <div className="card featured-main-card">
                    <img src={featured[0].image || `https://picsum.photos/seed/${featured[0]._id}/800/450`} alt="" className="featured-main-img" />
                    <div className="featured-main-overlay">
                      <span className="badge badge-red featured-main-badge">{featured[0].category}</span>
                      <h3 className="featured-main-title">{featured[0].titleAr}</h3>
                      <p className="featured-main-meta">👁 {featured[0].views} • {formatDate(featured[0].createdAt)}</p>
                    </div>
                  </div>
                </Link>
              )}
              {featured.length > 1 && (
                <div className="featured-side">
                  {featured.slice(1, 3).map(n => (
                    <Link key={n._id} to={`/news/${n._id}`} className="featured-side-link">
                      <div className="card featured-side-card">
                        <img src={n.image || `https://picsum.photos/seed/${n._id}/400/200`} alt="" className="featured-side-img" />
                        <div className="featured-side-overlay">
                          <h4 className="featured-side-title">{n.titleAr}</h4>
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
        <section className="home-section">
          <div className="home-section-header">
            <h2 className="section-title home-section-title">مباريات اليوم</h2>
            <Link to="/matches" className="home-section-link">عرض الكل →</Link>
          </div>
          {matches.length === 0 ? (
            <div className="home-matches-empty">لا توجد مباريات اليوم</div>
          ) : (
            <div className="home-matches-grid">
              {matches.map(m => (
                <div key={m._id} className="card home-match-card">
                  <div className="home-match-top">
                    <span className="home-match-competition">{m.competition}</span>
                    {m.status === 'live' ? <span className="badge badge-live">🔴 مباشر</span> :
                     m.status === 'finished' ? <span className="badge home-match-finished">انتهت</span> :
                     <span className="home-match-time">{formatTime(m.date)}</span>}
                  </div>
                  <div className="home-match-row">
                    <div className="home-match-team">
                      <div className="home-match-logo">{m.homeTeamLogo || '⚽'}</div>
                      <div className="home-match-name">{m.homeTeam}</div>
                    </div>
                    <div className="home-match-score">
                      {m.homeScore !== null && m.awayScore !== null ? (
                        <div className="home-match-score-value">{m.homeScore} - {m.awayScore}</div>
                      ) : <div className="home-match-vs">vs</div>}
                    </div>
                    <div className="home-match-team">
                      <div className="home-match-logo">{m.awayTeamLogo || '⚽'}</div>
                      <div className="home-match-name">{m.awayTeam}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Latest News Grid */}
        {restNews.length > 0 && (
          <section className="home-section">
            <div className="home-section-header">
              <h2 className="section-title home-section-title">آخر الأخبار</h2>
              <Link to="/news" className="home-section-link">عرض الكل →</Link>
            </div>
            <div className="grid-4">
              {restNews.map(n => (
                <Link key={n._id} to={`/news/${n._id}`} className="home-card-link">
                  <div className="card">
                    <img src={n.image || `https://picsum.photos/seed/${n._id}/400/220`} alt="" className="home-card-img" />
                    <div className="home-card-body">
                      <span className="badge badge-red home-card-badge">{n.category}</span>
                      <h4 className="home-card-title">{n.titleAr}</h4>
                      <p className="home-card-date">{formatDate(n.createdAt)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Videos Section */}
        {videos.length > 0 && (
          <section className="home-section">
            <div className="home-section-header">
              <h2 className="section-title home-section-title">فيديوهات</h2>
              <Link to="/videos" className="home-section-link">عرض الكل →</Link>
            </div>
            <div className="grid-4">
              {videos.map(v => (
                <Link key={v._id} to={`/videos/${v._id}`} className="home-card-link">
                  <div className="card">
                    <div className="home-video-thumb">
                      <img src={v.thumbnail || `https://picsum.photos/seed/${v._id}/400/225`} alt="" className="home-video-img" />
                      <div className="home-video-overlay">
                        <div className="home-video-play">▶</div>
                      </div>
                    </div>
                    <div className="home-video-body">
                      <h4 className="home-video-title">{v.titleAr}</h4>
                      <p className="home-video-views">👁 {v.views}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Stars */}
        {stars.length > 0 && (
          <section className="home-section">
            <div className="home-section-header">
              <h2 className="section-title home-section-title">نجوم</h2>
              <Link to="/stars" className="home-section-link">عرض الكل →</Link>
            </div>
            <div className="grid-4">
              {stars.map(s => (
                <Link key={s._id} to={`/stars/${s._id}`} className="home-card-link">
                  <div className="card home-star-card">
                    <img src={s.image || `https://picsum.photos/seed/${s._id}/200/200`} alt="" className="home-star-img" />
                    <h4 className="home-star-name">{s.nameAr}</h4>
                    <p className="home-star-sport">{s.sport}</p>
                    <p className="home-star-nationality">{s.nationalityAr || s.nationality}</p>
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
