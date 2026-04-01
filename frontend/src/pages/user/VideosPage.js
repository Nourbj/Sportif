import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 className="section-title">فيديوهات</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {cats.map(c => (
          <button key={c.val} onClick={() => { setCategory(c.val); setPage(1); }}
            style={{ padding: '8px 20px', borderRadius: '20px', border: `2px solid ${category === c.val ? '#CC0000' : '#ddd'}`, background: category === c.val ? '#CC0000' : 'white', color: category === c.val ? 'white' : '#555', fontFamily: 'Cairo', fontWeight: 700, cursor: 'pointer' }}>
            {c.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#CC0000', fontSize: '1.5rem' }}>⏳ جار التحميل...</div>
      ) : (
        <>
          <div className="grid-3" style={{ marginBottom: '40px' }}>
            {videos.map(v => (
              <Link key={v._id} to={`/videos/${v._id}`} style={{ textDecoration: 'none' }}>
                <div className="card">
                  <div style={{ position: 'relative' }}>
                    <img src={v.thumbnail || `https://picsum.photos/seed/${v._id}/640/360`} alt="" style={{ width: '100%', height: '195px', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)', transition: 'background 0.2s' }}>
                      <div style={{ width: '52px', height: '52px', background: '#CC0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: 'white', boxShadow: '0 4px 15px rgba(204,0,0,0.5)' }}>▶</div>
                    </div>
                    <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>{v.category}</span>
                  </div>
                  <div style={{ padding: '14px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.5, color: '#111', marginBottom: '8px' }}>{v.titleAr}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#999' }}>👁 {v.views} مشاهدة</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                style={{ width: '40px', height: '40px', borderRadius: '4px', border: `2px solid ${page === p ? '#CC0000' : '#ddd'}`, background: page === p ? '#CC0000' : 'white', color: page === p ? 'white' : '#555', fontFamily: 'Cairo', fontWeight: 700, cursor: 'pointer' }}>
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
