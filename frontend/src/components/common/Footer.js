import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: '#0A0A0A', color: 'white', marginTop: '20px' }}>
    <div className="container" style={{ padding: '15px 20px 10px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <img src="/images/logo.jpg" alt="Logo" style={{ height: '35px', width: '35px', borderRadius: '50%', objectFit: 'cover' }} />
          </div>
          <p style={{ color: '#aaa', lineHeight: 1.6, fontSize: '0.85rem' }}>
            مصدرك الرئيسي لأحدث الأخبار والتغطيات الرياضية، مع متابعة مستمرة وتحليلات دقيقة لأهم الأحداث المحلية والعالمية.
          </p>
        </div>
        <div>
          <h4 style={{ color: '#CC0000', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>الأقسام</h4>
          {[['آخر الأخبار', '/news'], ['مباريات اليوم', '/matches'], ['فيديوهات', '/videos'], ['نجوم', '/stars'], ['مقالات و تحليلات', '/articles']].map(([label, to]) => (
            <div key={to} style={{ marginBottom: '8px' }}>
              <Link to={to} style={{ color: '#aaa', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#CC0000'} onMouseLeave={e => e.target.style.color = '#aaa'}>
                {label}
              </Link>
            </div>
          ))}
        </div>
        <div>
          <h4 style={{ color: '#CC0000', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>تواصل معنا</h4>
          <p style={{ color: '#aaa', fontSize: '0.85rem', lineHeight: 1.6 }}>
            📧 contact@sportif.tn<br />
            📱 <span dir="ltr" style={{ unicodeBidi: 'embed' }}>+216 27601059</span><br />
            📍 تونس العاصمة، تونس
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
            <span style={{ color: '#aaa', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fab fa-facebook" style={{ color: '#1877F2', fontSize: '1.1rem' }}></i> sportif.tn
            </span>
            <span style={{ color: '#aaa', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fab fa-instagram" style={{ color: '#E4405F', fontSize: '1.1rem' }}></i> sportif.tn
            </span>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #222', paddingTop: '20px', textAlign: 'center', color: '#666', fontSize: '0.85rem' }}>
        © 2026 Sportif.tn - جميع الحقوق محفوظة
      </div>
    </div>
  </footer>
);

export default Footer;
