const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const News = require('./models/News');
const Match = require('./models/Match');
const Video = require('./models/Video');
const Star = require('./models/Star');
const Article = require('./models/Article');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sportif-tn');
  
  await Promise.all([User.deleteMany(), News.deleteMany(), Match.deleteMany(), Video.deleteMany(), Star.deleteMany(), Article.deleteMany()]);

  const admin = await User.create({ name: 'Admin', email: 'admin@sportif.tn', password: 'admin123', role: 'admin' });
  const user1 = await User.create({ name: 'Ahmed Ben Ali', email: 'ahmed@sportif.tn', password: 'user123' });

  const news = await News.insertMany([
    { title: 'Espérance wins championship', titleAr: 'الترجي يحرز اللقب', content: 'A great victory...', contentAr: 'فوز رائع للترجي...', category: 'football', author: admin._id, featured: true, image: 'https://picsum.photos/seed/news1/800/450', views: 1240 },
    { title: 'Club Africain qualifies for Africa', titleAr: 'النادي الأفريقي يتأهل لأفريقيا', content: 'Historic qualification...', contentAr: 'تأهل تاريخي...', category: 'football', author: admin._id, featured: true, image: 'https://picsum.photos/seed/news2/800/450', views: 980 },
    { title: 'National team training begins', titleAr: 'المنتخب الوطني يبدأ التدريبات', content: 'The team gathers...', contentAr: 'تجمع المنتخب...', category: 'football', author: admin._id, image: 'https://picsum.photos/seed/news3/800/450', views: 760 },
    { title: 'Tunisia Basketball Cup Finals', titleAr: 'كأس تونس لكرة السلة', content: 'Finals this weekend...', contentAr: 'النهائي هذا الأسبوع...', category: 'basketball', author: admin._id, image: 'https://picsum.photos/seed/news4/800/450', views: 420 },
    { title: 'Ons Jabeur returns to form', titleAr: 'أنس جابر تعود بقوة', content: 'Great performance...', contentAr: 'أداء رائع...', category: 'tennis', author: admin._id, featured: true, image: 'https://picsum.photos/seed/news5/800/450', views: 2100 },
  ]);

  const today = new Date();
  await Match.insertMany([
    { homeTeam: 'الترجي', awayTeam: 'النادي الأفريقي', date: new Date(today.setHours(16,0)), competition: 'الرابطة التونسية', status: 'upcoming', homeTeamLogo: '⭐', awayTeamLogo: '🔴' },
    { homeTeam: 'صفاقس', awayTeam: 'الإفريقي', date: new Date(today.setHours(18,0)), competition: 'الرابطة التونسية', status: 'upcoming', homeTeamLogo: '⚫', awayTeamLogo: '🟡' },
    { homeTeam: 'مانشستر سيتي', awayTeam: 'ريال مدريد', date: new Date(today.setHours(21,0)), competition: 'دوري أبطال أوروبا', status: 'upcoming', homeTeamLogo: '🔵', awayTeamLogo: '⚪' },
    { homeTeam: 'باريس سان جيرمان', awayTeam: 'برشلونة', date: new Date(today.setHours(21,0)), competition: 'دوري أبطال أوروبا', status: 'live', homeScore: 1, awayScore: 1, homeTeamLogo: '🔵', awayTeamLogo: '🔵' },
  ]);

  await Video.insertMany([
    { title: 'Best Goals Week 20', titleAr: 'أجمل الأهداف - الجولة 20', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/vid1/640/360', category: 'highlights', author: admin._id, views: 5400 },
    { title: 'Interview: Wahbi Khazri', titleAr: 'حوار مع وهبي خزري', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/vid2/640/360', category: 'interviews', author: admin._id, views: 3200 },
    { title: 'Tactical Analysis: El Derby', titleAr: 'تحليل تكتيكي: الديربي', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/vid3/640/360', category: 'analysis', author: admin._id, views: 2800 },
    { title: 'Ons Jabeur Highlights', titleAr: 'أبرز لحظات أنس جابر', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/vid4/640/360', category: 'highlights', author: admin._id, views: 7100 },
  ]);

  await Star.insertMany([
    { name: 'Wahbi Khazri', nameAr: 'وهبي خزري', sport: 'Football', nationality: 'Tunisia', nationalityAr: 'تونس', club: 'Club de sport Sfaxien', clubAr: 'نادي صفاقس الرياضي', image: 'https://picsum.photos/seed/star1/400/400', bio: 'Tunisian international footballer', bioAr: 'لاعب دولي تونسي', featured: true, stats: { goals: 42, caps: 61 } },
    { name: 'Ons Jabeur', nameAr: 'أنس جابر', sport: 'Tennis', nationality: 'Tunisia', nationalityAr: 'تونس', image: 'https://picsum.photos/seed/star2/400/400', bio: 'Top ranked tennis player', bioAr: 'لاعبة تنس من أعلى المصنفات', featured: true, stats: { ranking: 7, titles: 6 } },
    { name: 'Seifeddine Jaziri', nameAr: 'سيف الدين الجزيري', sport: 'Football', nationality: 'Tunisia', nationalityAr: 'تونس', club: 'CS Sfaxien', clubAr: 'نادي صفاقس', image: 'https://picsum.photos/seed/star3/400/400', bio: 'Prolific striker', bioAr: 'مهاجم مخيف', featured: false, stats: { goals: 28, caps: 35 } },
    { name: 'Dylan Bronn', nameAr: 'ديلان برون', sport: 'Football', nationality: 'Tunisia', nationalityAr: 'تونس', club: 'Salernitana', clubAr: 'ساليرنيتانا', image: 'https://picsum.photos/seed/star4/400/400', bio: 'Solid central defender', bioAr: 'مدافع وسطي متميز', featured: false, stats: { caps: 22 } },
  ]);

  await Article.insertMany([
    { title: 'Why Esperance dominates Tunisian football', titleAr: 'لماذا يهيمن الترجي على الكرة التونسية', content: 'A deep dive...', contentAr: 'تحليل معمّق...', type: 'analysis', author: admin._id, image: 'https://picsum.photos/seed/art1/800/450', views: 1560 },
    { title: 'The future of Tunisian football', titleAr: 'مستقبل كرة القدم التونسية', content: 'Young talents...', contentAr: 'المواهب الشابة...', type: 'opinion', author: admin._id, image: 'https://picsum.photos/seed/art2/800/450', views: 980 },
    { title: 'World Cup 2026: Tunisia\'s chances', titleAr: 'مونديال 2026: حظوظ تونس', content: 'Qualification analysis...', contentAr: 'تحليل التأهل...', type: 'analysis', author: admin._id, image: 'https://picsum.photos/seed/art3/800/450', views: 2340 },
  ]);

  console.log('✅ Database seeded!');
  console.log('👤 Admin: admin@sportif.tn / admin123');
  console.log('👤 User: ahmed@sportif.tn / user123');
  mongoose.disconnect();
};

seed().catch(console.error);
