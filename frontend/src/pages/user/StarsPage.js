import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const StarsPage = () => {
  const [stars, setStars] = useState([]);
  const [sport, setSport] = useState('');
  const [loading, setLoading] = useState(true);

  const sports = [{ val: '', label: 'الكل' }, { val: 'Football', label: 'كرة القدم' }, { val: 'Tennis', label: 'التنس' }, { val: 'Basketball', label: 'كرة السلة' }];

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/stars${sport ? `?sport=${sport}` : ''}`)
      .then(r => setStars(r.data))
      .finally(() => setLoading(false));
  }, [sport]);

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 className="section-title">نجوم الرياضة</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        {sports.map(s => (
          <button key={s.val} onClick={() => setSport(s.val)}
            style={{ padding: '8px 20px', borderRadius: '20px', border: `2px solid ${sport === s.val ? '#CC0000' : '#ddd'}`, background: sport === s.val ? '#CC0000' : 'white', color: sport === s.val ? 'white' : '#555', fontFamily: 'Cairo', fontWeight: 700, cursor: 'pointer' }}>
            {s.label}
          </button>
        ))}
      </div>
      {loading ? <div style={{ textAlign: 'center', padding: '60px', color: '#CC0000', fontSize: '1.5rem' }}>⏳ جار التحميل...</div> : (
        <div className="grid-4">
          {stars.map(s => (
            <Link key={s._id} to={`/stars/${s._id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ textAlign: 'center', padding: '30px 20px' }}>
                {s.featured && <div style={{ position: 'relative' }}><span style={{ position: 'absolute', top: '-20px', right: '-10px', background: '#FFD700', color: '#333', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>⭐ نجم</span></div>}
                <img src={s.image || `https://picsum.photos/seed/${s._id}/200/200`} alt="" style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #CC0000', marginBottom: '16px' }} />
                <h3 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '6px' }}>{s.nameAr}</h3>
                <p style={{ color: '#CC0000', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>{s.sport}</p>
                <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '4px' }}>{s.nationalityAr || s.nationality}</p>
                {s.clubAr && <p style={{ color: '#555', fontSize: '0.82rem' }}>{s.clubAr}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default StarsPage;
