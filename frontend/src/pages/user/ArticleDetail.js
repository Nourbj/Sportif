import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ArticleDetail.css';

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

  if (!article) return <div className="article-detail-loading">⏳ جار التحميل...</div>;

  const typeLabel = { analysis: 'تحليل', opinion: 'رأي', report: 'تقرير' };
  const typeColor = { analysis: '#1a73e8', opinion: '#e8a01a', report: '#1aae6f' };

  return (
    <div className="container article-detail">
      <Link to="/articles" className="article-detail-back">العودة للمقالات ←</Link>
      <div className="article-detail-grid">
        <article>
          <span className={`badge article-detail-badge article-detail-badge-${article.type}`}>{typeLabel[article.type]}</span>
          <h1 className="article-detail-title">{article.titleAr}</h1>
          <div className="article-detail-meta">
            <span>✍ {article.author?.name}</span>
            <span>📅 {formatDate(article.createdAt)}</span>
            <span>👁 {article.views} قراءة</span>
          </div>
          <img src={article.image || `https://picsum.photos/seed/${article._id}/800/450`} alt="" className="article-detail-image" />
          <div className="article-detail-content">{article.contentAr}</div>
        </article>
        <aside>
          <h3 className="article-detail-aside-title">مقالات ذات صلة</h3>
          {related.slice(0, 4).map(a => (
            <Link key={a._id} to={`/articles/${a._id}`} className="article-detail-related-link">
              <div className="article-detail-related-card">
                <img src={a.image || `https://picsum.photos/seed/${a._id}/100/70`} alt="" className="article-detail-related-img" />
                <div>
                  <p className="article-detail-related-title">{a.titleAr}</p>
                  <p className="article-detail-related-date">{formatDate(a.createdAt)}</p>
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
