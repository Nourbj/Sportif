import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import './ArticlesPage.css';

const formatDate = (d) => new Date(d).toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' });

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const types = [{ val: '', label: 'الكل' }, { val: 'analysis', label: 'تحليلات' }, { val: 'opinion', label: 'آراء' }, { val: 'report', label: 'تقارير' }];

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/articles?page=${page}&limit=9${type ? `&type=${type}` : ''}`)
      .then(r => { setArticles(r.data.articles); setTotalPages(r.data.pages); })
      .finally(() => setLoading(false));
  }, [page, type]);

  return (
    <div className="container articles-page">
      <h1 className="section-title">مقالات و تحليلات</h1>
      <div className="articles-filters">
        {types.map(t => (
          <button key={t.val} onClick={() => { setType(t.val); setPage(1); }}
            className={`articles-filter-btn${type === t.val ? ' is-active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>
      {loading ? <div className="articles-loading">⏳ جار التحميل...</div> : (
        <>
          <div className="grid-3 articles-grid">
            {articles.map(a => (
              <Link key={a._id} to={`/articles/${a._id}`} className="articles-card-link">
                <div className="card">
                  {a.image && a.image.length > 5 && <img src={getFullImageUrl(a.image)} alt="" className="articles-card-img" />}
                  <div className="articles-card-body">
                    <div className="articles-card-meta">
                      <span className={`badge articles-card-badge articles-card-badge-${a.type}`}>
                        {a.type === 'analysis' ? 'تحليل' : a.type === 'opinion' ? 'رأي' : 'تقرير'}
                      </span>
                      <span className="articles-card-date">{formatDate(a.createdAt)}</span>
                    </div>
                    <h3 className="articles-card-title">{a.titleAr}</h3>
                    <p className="articles-card-sub">✍ {a.author?.name} • 👁 {a.views}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="articles-pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`articles-page-btn${page === p ? ' is-active' : ''}`}>
                {p}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ArticlesPage;
