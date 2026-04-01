import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const formatDate = (d) => new Date(d).toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' });

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    axios.get(`/api/news/${id}`).then(r => {
      setNews(r.data);
      axios.get(`/api/news?category=${r.data.category}&limit=4`).then(res => setRelated(res.data.news.filter(n => n._id !== id)));
    });
  }, [id]);

  if (!news) return <div style={{ textAlign: 'center', padding: '80px', color: '#CC0000', fontSize: '1.5rem' }}>⏳ جار التحميل...</div>;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
        <article>
          <Link to="/news" style={{ color: '#CC0000', fontWeight: 700, marginBottom: '20px', display: 'inline-block' }}>← العودة للأخبار</Link>
          <span className="badge badge-red" style={{ marginBottom: '12px', display: 'block', width: 'fit-content' }}>{news.category}</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.4, marginBottom: '16px' }}>{news.titleAr}</h1>
          <div style={{ display: 'flex', gap: '20px', color: '#888', fontSize: '0.9rem', marginBottom: '24px', borderBottom: '2px solid #f0f0f0', paddingBottom: '16px' }}>
            <span>✍ {news.author?.name}</span>
            <span>📅 {formatDate(news.createdAt)}</span>
            <span>👁 {news.views} مشاهدة</span>
          </div>
          <img src={news.image || `https://picsum.photos/seed/${news._id}/800/450`} alt="" style={{ width: '100%', borderRadius: '8px', marginBottom: '28px', maxHeight: '420px', objectFit: 'cover' }} />
          <div style={{ lineHeight: 2, fontSize: '1.05rem', color: '#333' }}>{news.contentAr}</div>
        </article>
        <aside>
          <h3 style={{ borderRight: '4px solid #CC0000', paddingRight: '12px', fontWeight: 800, marginBottom: '20px' }}>أخبار ذات صلة</h3>
          {related.slice(0, 4).map(n => (
            <Link key={n._id} to={`/news/${n._id}`} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', padding: '12px', borderRadius: '8px', border: '1px solid #eee', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#CC0000'} onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}>
                <img src={n.image || `https://picsum.photos/seed/${n._id}/100/70`} alt="" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.4, color: '#111' }}>{n.titleAr}</p>
                  <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '4px' }}>{formatDate(n.createdAt)}</p>
                </div>
              </div>
            </Link>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default NewsDetail;
