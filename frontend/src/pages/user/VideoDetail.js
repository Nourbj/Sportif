import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    axios.get(`/api/videos/${id}`).then(r => {
      setVideo(r.data);
      axios.get(`/api/videos?category=${r.data.category}&limit=5`).then(res =>
        setRelated(res.data.videos.filter(v => v._id !== id))
      );
    });
  }, [id]);

  if (!video) return <div style={{ textAlign: 'center', padding: '80px', color: '#CC0000', fontSize: '1.5rem' }}>⏳ جار التحميل...</div>;

  const getYTEmbed = (url) => {
    if (url.includes('youtube.com/embed/')) return url;
    const match = url.match(/(?:youtu\.be\/|v=)([^&\n?#]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <Link to="/videos" style={{ color: '#CC0000', fontWeight: 700, marginBottom: '20px', display: 'inline-block' }}>← العودة للفيديوهات</Link>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
        <div>
          <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', background: '#000', aspectRatio: '16/9' }}>
            <iframe src={getYTEmbed(video.url)} style={{ width: '100%', height: '100%' }} frameBorder="0" allowFullScreen title={video.titleAr} />
          </div>
          <span className="badge badge-red" style={{ marginBottom: '10px', display: 'inline-block' }}>{video.category}</span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '12px' }}>{video.titleAr}</h1>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '16px' }}>👁 {video.views} مشاهدة • ✍ {video.author?.name}</p>
          {video.descriptionAr && <p style={{ lineHeight: 1.9, color: '#444' }}>{video.descriptionAr}</p>}
        </div>
        <aside>
          <h3 style={{ borderRight: '4px solid #CC0000', paddingRight: '12px', fontWeight: 800, marginBottom: '20px' }}>فيديوهات ذات صلة</h3>
          {related.slice(0, 4).map(v => (
            <Link key={v._id} to={`/videos/${v._id}`} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', padding: '10px', borderRadius: '8px', border: '1px solid #eee' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#CC0000'} onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img src={v.thumbnail || `https://picsum.photos/seed/${v._id}/160/90`} alt="" style={{ width: '90px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '24px', height: '24px', background: '#CC0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'white' }}>▶</div>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.4, color: '#111' }}>{v.titleAr}</p>
                  <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '4px' }}>👁 {v.views}</p>
                </div>
              </div>
            </Link>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default VideoDetail;
