import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import './StarsPage.css';

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
    <div className="container stars-page">
      <h1 className="section-title">نجوم الرياضة</h1>
      <div className="stars-filters">
        {sports.map(s => (
          <button key={s.val} onClick={() => setSport(s.val)}
            className={`stars-filter-btn${sport === s.val ? ' is-active' : ''}`}>
            {s.label}
          </button>
        ))}
      </div>
      {loading ? <div className="stars-loading">⏳ جار التحميل...</div> : (
        <div className="grid-4">
          {stars.map(s => (
            <Link key={s._id} to={`/stars/${s._id}`} className="stars-card-link">
              <div className="card stars-card">
                {s.featured && <div className="stars-featured"><span className="stars-featured-badge">⭐ نجم</span></div>}
                {s.image && s.image.length > 5 && <img src={getFullImageUrl(s.image)} alt="" className="stars-avatar" />}
                <h3 className="stars-name">{s.nameAr}</h3>
                <p className="stars-sport">{s.sport}</p>
                <p className="stars-nationality">{s.nationalityAr || s.nationality}</p>
                {s.clubAr && <p className="stars-club">{s.clubAr}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default StarsPage;
