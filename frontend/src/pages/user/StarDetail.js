import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getEmbedUrl, isDirectVideo } from '../../utils/videoUtils';
import { getFullImageUrl } from '../../utils/imageUtils';
import './StarDetail.css';

const StarDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [star, setStar] = useState(null);

  useEffect(() => { axios.get(`/api/stars/${id}`).then(r => setStar(r.data)); }, [id]);

  if (!star) return <div className="star-detail-loading">⏳ جار التحميل...</div>;

  const sportLabels = {
    Football: 'كرة القدم',
    Tennis: 'التنس',
    Basketball: 'كرة السلة',
    Athletics: 'ألعاب القوى',
    Swimming: 'السباحة',
    Other: 'أخرى'
  };

  const statLabels = {
    goals: 'الأهداف',
    assists: 'التمريرات الحاسمة',
    matches: 'المباريات',
    rating: 'التقييم',
    caps: 'المشاركات',
    cleanSheets: 'شباك نظيفة',
    saves: 'التصديات',
    tackles: 'الافتكاكات',
    interceptions: 'الاعتراضات',
    ranking: 'الترتيب',
    titles: 'الألقاب',
    medals: 'الميداليات',
    golds: 'ميداليات ذهبية',
    events: 'السباقات',
    bestTime: 'أفضل توقيت'
  };

  return (
    <div className="container star-detail">
      <Link to={`/stars${location.search || ''}`} className="star-detail-back">العودة للنجوم ←</Link>
      <div className="star-detail-grid">
        <div className="star-detail-profile">
          {star.image && <img src={getFullImageUrl(star.image)} alt="" className="star-detail-avatar" />}
          <h1 className="star-detail-name">{star.nameAr}</h1>
          <p className="star-detail-sport">{sportLabels[star.sport] || 'أخرى'}</p>
          {star.position && <p className="star-detail-position">{star.position}</p>}
          {star.age ? <p className="star-detail-age">العمر: {star.age}</p> : null}
          <p className="star-detail-nationality">{`${star.nationalityFlag ? `${star.nationalityFlag} ` : ''}${star.nationalityAr || ''}`}</p>
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
            <div className="star-detail-section">
              <h3 className="star-detail-section-title">الإحصائيات</h3>
              <div className="star-detail-stats">
                {Object.entries(star.stats).map(([key, val]) => (
                  <div key={key} className="star-detail-stat">
                    <div className="star-detail-stat-value">{val}</div>
                    <div className="star-detail-stat-key">{statLabels[key] || 'إحصائية'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {star.videoUrl && (
            <div className="star-detail-section">
              <h3 className="star-detail-section-title">فيديو</h3>
              <div className="star-detail-video-wrapper">
                {getEmbedUrl(star.videoUrl) ? (
                  <div className="video-responsive">
                    <iframe
                      src={getEmbedUrl(star.videoUrl)}
                      title="Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : isDirectVideo(star.videoUrl) ? (
                  <video controls className="star-detail-direct-video">
                    <source src={star.videoUrl} type={`video/${star.videoUrl.split('.').pop()}`} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="star-detail-video-link">
                    <a href={star.videoUrl} target="_blank" rel="noopener noreferrer" className="btn-red">
                      مشاهدة فيديو النجم 📺
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StarDetail;
