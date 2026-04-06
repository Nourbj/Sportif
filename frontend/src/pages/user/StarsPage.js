import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import './StarsPage.css';

const StarsPage = () => {
  const [stars, setStars] = useState([]);
  const [sport, setSport] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [loading, setLoading] = useState(true);

  const sports = [{ val: '', label: 'الكل' }, { val: 'Football', label: 'كرة القدم' }, { val: 'Tennis', label: 'التنس' }, { val: 'Basketball', label: 'كرة السلة' }];
  const pageSizes = [4, 8, 12, 16];

  const getPageItems = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const delta = 2;
    const left = Math.max(1, current - delta);
    const right = Math.min(total, current + delta);
    const items = [];
    if (left > 1) {
      items.push(1);
      if (left > 2) items.push('…');
    }
    for (let i = left; i <= right; i += 1) items.push(i);
    if (right < total) {
      if (right < total - 1) items.push('…');
      items.push(total);
    }
    return items;
  };

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/stars?page=${page}&limit=${pageSize}${sport ? `&sport=${sport}` : ''}`)
      .then(r => { setStars(r.data.stars || []); setTotalPages(r.data.pages || 1); })
      .finally(() => setLoading(false));
  }, [sport, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  return (
    <div className="container stars-page">
      <h1 className="section-title">نجوم الرياضة</h1>
      <div className="stars-filters">
        {sports.map(s => (
          <button key={s.val} onClick={() => { setSport(s.val); setPage(1); }}
            className={`stars-filter-btn${sport === s.val ? ' is-active' : ''}`}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="stars-page-controls">
        <span className="stars-page-info">عدد العناصر:</span>
        <select
          className="stars-page-select"
          value={pageSize}
          onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}
        >
          {pageSizes.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span className="stars-page-info">صفحة {page} من {totalPages}</span>
      </div>
      {loading ? <div className="stars-loading">⏳ جار التحميل...</div> : (
        <>
          <div className="grid-4">
            {stars.map(s => (
              <Link key={s._id} to={`/stars/${s._id}`} className="stars-card-link">
                <div className="card stars-card">
                {s.featured && (
                  <div className="stars-featured">
                    <span className="stars-featured-badge" aria-label="نجم">
                      <svg viewBox="0 0 24 24" className="stars-featured-icon" aria-hidden="true">
                        <path d="M12 2.5l2.98 6.05 6.67.97-4.82 4.7 1.14 6.64L12 17.8 6.03 20.86l1.14-6.64-4.82-4.7 6.67-.97L12 2.5z" />
                      </svg>
                    </span>
                  </div>
                )}
                  <img src={s.image && s.image.length > 5 ? getFullImageUrl(s.image) : '/images/placeholder.png'} alt="" className="stars-avatar" />
                  <h3 className="stars-name">{s.nameAr}</h3>
                  <p className="stars-sport">{s.sport}</p>
                  <p className="stars-nationality">{s.nationalityAr || s.nationality}</p>
                  {s.clubAr && <p className="stars-club">{s.clubAr}</p>}
                </div>
              </Link>
            ))}
          </div>
          <div className="stars-pagination">
            <button
              className="stars-page-btn"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <svg className="pagination-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
              السابق
            </button>
            {getPageItems(page, totalPages).map((p, idx) => (
              typeof p === 'number' ? (
                <button key={p} onClick={() => setPage(p)}
                  className={`stars-page-btn${page === p ? ' is-active' : ''}`}>
                  {p}
                </button>
              ) : (
                <span key={`dots-${idx}`} className="stars-page-ellipsis">{p}</span>
              )
            ))}
            <button
              className="stars-page-btn"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              التالي
              <svg className="pagination-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StarsPage;
