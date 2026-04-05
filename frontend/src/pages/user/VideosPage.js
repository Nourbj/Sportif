import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import './VideosPage.css';

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const cats = [{ val: '', label: 'الكل' }, { val: 'highlights', label: 'ملخصات' }, { val: 'interviews', label: 'مقابلات' }, { val: 'analysis', label: 'تحليلات' }];

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/videos?page=${page}&limit=12${category ? `&category=${category}` : ''}`)
      .then(r => { setVideos(r.data.videos); setTotalPages(r.data.pages); })
      .finally(() => setLoading(false));
  }, [page, category]);

  return (
    <div className="container videos-page">
      <h1 className="section-title">فيديوهات</h1>
      <div className="videos-filters">
        {cats.map(c => (
          <button key={c.val} onClick={() => { setCategory(c.val); setPage(1); }}
            className={`videos-filter-btn${category === c.val ? ' is-active' : ''}`}>
            {c.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="videos-loading">⏳ جار التحميل...</div>
      ) : (
        <>
          <div className="grid-3 videos-grid">
            {videos.map(v => (
              <Link key={v._id} to={`/videos/${v._id}`} className="videos-card-link">
                <div className="card">
                  <div className="videos-thumb">
                    {v.thumbnail && <img src={getFullImageUrl(v.thumbnail)} alt="" className="videos-thumb-img" />}
                    <div className="videos-thumb-overlay">
                      <div className="videos-play">▶</div>
                    </div>
                    <span className="videos-category">{v.category}</span>
                  </div>
                  <div className="videos-card-body">
                    <h3 className="videos-card-title">{v.titleAr}</h3>
                    <p className="videos-card-views">👁 {v.views} مشاهدة</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="videos-pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`videos-page-btn${page === p ? ' is-active' : ''}`}>
                {p}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VideosPage;
