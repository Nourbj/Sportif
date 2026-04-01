import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 className="section-title">آخر الأخبار</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {cats.map(c => (
          <button key={c.val} onClick={() => { setCategory(c.val); setPage(1); }}
            style={{ padding: '8px 18px', borderRadius: '20px', border: `2px solid ${category === c.val ? '#CC0000' : '#ddd'}`, background: category === c.val ? '#CC0000' : 'white', color: category === c.val ? 'white' : '#555', fontFamily: 'Cairo', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
            {c.label}
          </button>
        ))}
      </div>
      {loading ? <div style={{ textAlign: 'center', padding: '60px', color: '#CC0000', fontSize: '1.5rem' }}>⏳ جار التحميل...</div> : (
        <>
          <div className="grid-3" style={{ marginBottom: '40px' }}>
            {news.map(n => (
              <Link key={n._id} to={`/news/${n._id}`} style={{ textDecoration: 'none' }}>
                <div className="card">
                  <img src={n.image || `https://picsum.photos/seed/${n._id}/400/220`} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className="badge badge-red" style={{ fontSize: '0.72rem' }}>{n.category}</span>
                      <span style={{ fontSize: '0.78rem', color: '#999' }}>{formatDate(n.createdAt)}</span>
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.5, color: '#111' }}>{n.titleAr}</h3>
                    <p style={{ fontSize: '0.82rem', color: '#666', marginTop: '6px' }}>👁 {n.views} مشاهدة</p>
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

export default NewsPage;
