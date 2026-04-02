import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './StarDetail.css';

const StarDetail = () => {
  const { id } = useParams();
  const [star, setStar] = useState(null);

  useEffect(() => { axios.get(`/api/stars/${id}`).then(r => setStar(r.data)); }, [id]);

  if (!star) return <div className="star-detail-loading">⏳ جار التحميل...</div>;

  return (
    <div className="container star-detail">
      <Link to="/stars" className="star-detail-back">العودة للنجوم ←</Link>
      <div className="star-detail-grid">
        <div className="star-detail-profile">
          <img src={star.image || `https://picsum.photos/seed/${star._id}/300/300`} alt="" className="star-detail-avatar" />
          <h1 className="star-detail-name">{star.nameAr}</h1>
          <p className="star-detail-sport">{star.sport}</p>
          <p className="star-detail-nationality">{star.nationalityAr || star.nationality}</p>
          {star.clubAr && <p className="star-detail-club">{star.clubAr}</p>}
        </div>
        <div>
          {star.bioAr && (
            <div className="star-detail-section">
              <h3 className="star-detail-section-title">السيرة الذاتية</h3>
              <p className="star-detail-bio">{star.bioAr}</p>
            </div>
          )}
          {star.stats && Object.keys(star.stats).length > 0 && (
            <div>
              <h3 className="star-detail-section-title">الإحصائيات</h3>
              <div className="star-detail-stats">
                {Object.entries(star.stats).map(([key, val]) => (
                  <div key={key} className="star-detail-stat">
                    <div className="star-detail-stat-value">{val}</div>
                    <div className="star-detail-stat-key">{key}</div>
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
