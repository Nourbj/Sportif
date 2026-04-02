import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: '#0A0A0A', color: 'white', marginTop: '60px' }}>
    <div className="container" style={{ padding: '50px 20px 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', marginBottom: '40px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <img src="/images/logo.jpg" alt="Logo" style={{ height: '45px', width: '45px', borderRadius: '50%', objectFit: 'cover' }} />
          </div>
          <p style={{ color: '#aaa', lineHeight: 1.8, fontSize: '0.9rem' }}>
            مصدرك الرئيسي لأحدث الأخبار والتغطيات الرياضية، مع متابعة مستمرة وتحليلات دقيقة لأهم الأحداث المحلية والعالمية.
          </p>
        </div>
        <div>
          <h4 style={{ color: '#CC0000', marginBottom: '16px', fontWeight: 700 }}>الأقسام</h4>
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
          <h4 style={{ color: '#CC0000', marginBottom: '16px', fontWeight: 700 }}>تواصل معنا</h4>
          <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 1.8 }}>
            📧 contact@sportif.tn<br />
            📱 +216 XX XXX XXX<br />
            📍 تونس العاصمة، تونس
          </p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #222', paddingTop: '20px', textAlign: 'center', color: '#666', fontSize: '0.85rem' }}>
        © 2026 Sportif.tn - جميع الحقوق محفوظة
      </div>
    </div>
  </footer>
);

export default Footer;
