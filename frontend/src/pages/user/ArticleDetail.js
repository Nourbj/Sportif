import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getEmbedUrl, isDirectVideo } from '../../utils/videoUtils';
import { getFullImageUrl } from '../../utils/imageUtils';
import './ArticleDetail.css';

const formatDate = (d) => new Date(d).toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' });

const ArticleDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    axios.get(`/api/articles/${id}`).then(r => {
      setArticle(r.data);
      const viewKey = `article_viewed_${id}`;
      if (!localStorage.getItem(viewKey)) {
        localStorage.setItem(viewKey, '1');
        axios.post(`/api/articles/${id}/view`)
          .then(res => {
            if (res.data && typeof res.data.views === 'number') {
              setArticle(prev => prev ? { ...prev, views: res.data.views } : prev);
            }
          })
          .catch(() => {});
      }
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
      <Link to={`/articles${location.search || ''}`} className="article-detail-back">العودة للمقالات ←</Link>
      <div className="article-detail-grid">
        <article>
          <span className={`badge article-detail-badge article-detail-badge-${article.type}`}>{typeLabel[article.type]}</span>
          <h1 className="article-detail-title">{article.titleAr}</h1>
          <div className="article-detail-meta">
            <span>✍ {article.author?.name}</span>
            <span>📅 {formatDate(article.createdAt)}</span>
            <span>👁 {article.views} قراءة</span>
          </div>
          {article.image && <img src={getFullImageUrl(article.image)} alt="" className="article-detail-image" />}
          
          {article.videoUrl && (
            <div className="article-detail-video-wrapper">
              {getEmbedUrl(article.videoUrl) ? (
                <div className="video-responsive">
                  <iframe
                    src={getEmbedUrl(article.videoUrl)}
                    title="Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : isDirectVideo(article.videoUrl) ? (
                <video controls className="article-detail-direct-video">
                  <source src={article.videoUrl} type={`video/${article.videoUrl.split('.').pop()}`} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="article-detail-video-link">
                  <a href={article.videoUrl} target="_blank" rel="noopener noreferrer" className="btn-red">
                    مشاهدة الفيديو المصاحب 📺
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="article-detail-content">{article.contentAr}</div>
        </article>
        <aside>
          <h3 className="article-detail-aside-title">مقالات ذات صلة</h3>
          {related.slice(0, 4).map(a => (
            <Link key={a._id} to={`/articles/${a._id}`} className="article-detail-related-link">
              <div className="article-detail-related-card">
                <img src={getFullImageUrl(a.image) || `https://picsum.photos/seed/${a._id}/80/50`} alt="" className="article-detail-related-img" />
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
