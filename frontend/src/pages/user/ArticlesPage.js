import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 className="section-title">مقالات و تحليلات</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        {types.map(t => (
          <button key={t.val} onClick={() => { setType(t.val); setPage(1); }}
            style={{ padding: '8px 20px', borderRadius: '20px', border: `2px solid ${type === t.val ? '#CC0000' : '#ddd'}`, background: type === t.val ? '#CC0000' : 'white', color: type === t.val ? 'white' : '#555', fontFamily: 'Cairo', fontWeight: 700, cursor: 'pointer' }}>
            {t.label}
          </button>
        ))}
      </div>
      {loading ? <div style={{ textAlign: 'center', padding: '60px', color: '#CC0000', fontSize: '1.5rem' }}>⏳ جار التحميل...</div> : (
        <>
          <div className="grid-3" style={{ marginBottom: '40px' }}>
            {articles.map(a => (
              <Link key={a._id} to={`/articles/${a._id}`} style={{ textDecoration: 'none' }}>
                <div className="card">
                  <img src={a.image || `https://picsum.photos/seed/${a._id}/400/220`} alt="" style={{ width: '100%', height: '195px', objectFit: 'cover' }} />
                  <div style={{ padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span className="badge" style={{ background: a.type === 'analysis' ? '#1a73e8' : a.type === 'opinion' ? '#e8a01a' : '#1aae6f', color: 'white', fontSize: '0.72rem' }}>
                        {a.type === 'analysis' ? 'تحليل' : a.type === 'opinion' ? 'رأي' : 'تقرير'}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#999' }}>{formatDate(a.createdAt)}</span>
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.5, color: '#111', marginBottom: '8px' }}>{a.titleAr}</h3>
                    <p style={{ fontSize: '0.82rem', color: '#888' }}>✍ {a.author?.name} • 👁 {a.views}</p>
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

export default ArticlesPage;
