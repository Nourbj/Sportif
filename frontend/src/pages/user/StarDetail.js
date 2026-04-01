import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const StarDetail = () => {
  const { id } = useParams();
  const [star, setStar] = useState(null);

  useEffect(() => { axios.get(`/api/stars/${id}`).then(r => setStar(r.data)); }, [id]);

  if (!star) return <div style={{ textAlign: 'center', padding: '80px', color: '#CC0000', fontSize: '1.5rem' }}>⏳ جار التحميل...</div>;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <Link to="/stars" style={{ color: '#CC0000', fontWeight: 700, marginBottom: '20px', display: 'inline-block' }}>← العودة للنجوم</Link>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px', alignItems: 'start' }}>
        <div style={{ textAlign: 'center' }}>
          <img src={star.image || `https://picsum.photos/seed/${star._id}/300/300`} alt="" style={{ width: '220px', height: '220px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #CC0000', marginBottom: '20px' }} />
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '8px' }}>{star.nameAr}</h1>
          <p style={{ color: '#CC0000', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>{star.sport}</p>
          <p style={{ color: '#888' }}>{star.nationalityAr || star.nationality}</p>
          {star.clubAr && <p style={{ color: '#555', marginTop: '4px' }}>{star.clubAr}</p>}
        </div>
        <div>
          {star.bioAr && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ borderRight: '4px solid #CC0000', paddingRight: '12px', fontWeight: 800, marginBottom: '16px' }}>السيرة الذاتية</h3>
              <p style={{ lineHeight: 2, color: '#444', fontSize: '1rem' }}>{star.bioAr}</p>
            </div>
          )}
          {star.stats && Object.keys(star.stats).length > 0 && (
            <div>
              <h3 style={{ borderRight: '4px solid #CC0000', paddingRight: '12px', fontWeight: 800, marginBottom: '16px' }}>الإحصائيات</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {Object.entries(star.stats).map(([key, val]) => (
                  <div key={key} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', textAlign: 'center', border: '1px solid #eee' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#CC0000' }}>{val}</div>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '4px' }}>{key}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StarDetail;
