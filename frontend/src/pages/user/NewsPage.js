import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import './NewsPage.css';

const formatDate = (d) => new Date(d).toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' });

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const cats = [{ val: '', label: 'الكل' }, { val: 'football', label: 'كرة القدم' }, { val: 'basketball', label: 'كرة السلة' }, { val: 'tennis', label: 'التنس' }, { val: 'local', label: 'محلي' }, { val: 'international', label: 'دولي' }];

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/news?page=${page}&limit=12${category ? `&category=${category}` : ''}`)
      .then(r => { setNews(r.data.news); setTotalPages(r.data.pages); })
      .finally(() => setLoading(false));
  }, [page, category]);

  return (
    <div className="container news-page">
      <h1 className="section-title">آخر الأخبار</h1>
      <div className="news-filters">
        {cats.map(c => (
          <button key={c.val} onClick={() => { setCategory(c.val); setPage(1); }}
            className={`news-filter-btn${category === c.val ? ' is-active' : ''}`}>
            {c.label}
          </button>
        ))}
      </div>
      {loading ? <div className="news-loading">⏳ جار التحميل...</div> : news.length === 0 ? (
        <div className="news-empty">
          لا توجد أخبار حالياً
        </div>
      ) : (
        <>
          <div className="grid-3 news-grid">
            {news.map(n => (
              <Link key={n._id} to={`/news/${n._id}`} className="news-card-link">
                <div className="card">
                  <img src={n.image && n.image.length > 5 ? getFullImageUrl(n.image) : '/images/placeholder.png'} alt="" className="news-card-img" />
                  <div className="news-card-body">
                    <div className="news-card-meta">
                      <span className="badge badge-red news-card-badge">{n.category}</span>
                      <span className="news-card-date">{formatDate(n.createdAt)}</span>
                    </div>
                    <h3 className="news-card-title">{n.titleAr}</h3>
                    <p className="news-card-views">👁 {n.views} مشاهدة</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="news-pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`news-page-btn${page === p ? ' is-active' : ''}`}>
                {p}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NewsPage;
