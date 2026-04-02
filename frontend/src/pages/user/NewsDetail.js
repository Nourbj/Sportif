import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './NewsDetail.css';

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

  if (!news) return <div className="news-detail-loading">⏳ جار التحميل...</div>;

  return (
    <div className="container news-detail">
      <div className="news-detail-grid">
        <article>
          <Link to="/news" className="news-detail-back">العودة للأخبار ←</Link>
          <span className="badge badge-red news-detail-badge">{news.category}</span>
          <h1 className="news-detail-title">{news.titleAr}</h1>
          <div className="news-detail-meta">
            <span>✍ {news.author?.name}</span>
            <span>📅 {formatDate(news.createdAt)}</span>
            <span>👁 {news.views} مشاهدة</span>
          </div>
          <img src={news.image || `https://picsum.photos/seed/${news._id}/800/450`} alt="" className="news-detail-image" />
          <div className="news-detail-content">{news.contentAr}</div>
        </article>
        <aside>
          <h3 className="news-detail-aside-title">أخبار ذات صلة</h3>
          {related.slice(0, 4).map(n => (
            <Link key={n._id} to={`/news/${n._id}`} className="news-detail-related-link">
              <div className="news-detail-related-card">
                <img src={n.image || `https://picsum.photos/seed/${n._id}/100/70`} alt="" className="news-detail-related-img" />
                <div>
                  <p className="news-detail-related-title">{n.titleAr}</p>
                  <p className="news-detail-related-date">{formatDate(n.createdAt)}</p>
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
