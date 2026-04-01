import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const formatDate = (d) => new Date(d).toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' });

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    axios.get(`/api/articles/${id}`).then(r => {
      setArticle(r.data);
      axios.get(`/api/articles?type=${r.data.type}&limit=4`).then(res =>
        setRelated(res.data.articles.filter(a => a._id !== id))
      );
    });
  }, [id]);

  if (!article) return <div style={{ textAlign: 'center', padding: '80px', color: '#CC0000', fontSize: '1.5rem' }}>⏳ جار التحميل...</div>;

  const typeLabel = { analysis: 'تحليل', opinion: 'رأي', report: 'تقرير' };
  const typeColor = { analysis: '#1a73e8', opinion: '#e8a01a', report: '#1aae6f' };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <Link to="/articles" style={{ color: '#CC0000', fontWeight: 700, marginBottom: '20px', display: 'inline-block' }}>← العودة للمقالات</Link>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
        <article>
          <span className="badge" style={{ background: typeColor[article.type], color: 'white', marginBottom: '12px', display: 'inline-block' }}>{typeLabel[article.type]}</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.4, marginBottom: '16px' }}>{article.titleAr}</h1>
          <div style={{ display: 'flex', gap: '20px', color: '#888', fontSize: '0.9rem', marginBottom: '24px', borderBottom: '2px solid #f0f0f0', paddingBottom: '16px' }}>
            <span>✍ {article.author?.name}</span>
            <span>📅 {formatDate(article.createdAt)}</span>
            <span>👁 {article.views} قراءة</span>
          </div>
          <img src={article.image || `https://picsum.photos/seed/${article._id}/800/450`} alt="" style={{ width: '100%', borderRadius: '8px', marginBottom: '28px', maxHeight: '420px', objectFit: 'cover' }} />
          <div style={{ lineHeight: 2.2, fontSize: '1.05rem', color: '#333' }}>{article.contentAr}</div>
        </article>
        <aside>
          <h3 style={{ borderRight: '4px solid #CC0000', paddingRight: '12px', fontWeight: 800, marginBottom: '20px' }}>مقالات ذات صلة</h3>
          {related.slice(0, 4).map(a => (
            <Link key={a._id} to={`/articles/${a._id}`} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', padding: '12px', borderRadius: '8px', border: '1px solid #eee' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#CC0000'} onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}>
                <img src={a.image || `https://picsum.photos/seed/${a._id}/100/70`} alt="" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.4, color: '#111' }}>{a.titleAr}</p>
                  <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '4px' }}>{formatDate(a.createdAt)}</p>
                </div>
              </div>
            </Link>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default ArticleDetail;
