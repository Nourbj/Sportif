# Sportif.tn — موقع الرياضة التونسي 🔴⚽

منصة رياضية متكاملة بـ MERN Stack — أخبار، مباريات، فيديوهات، نجوم، مقالات.

---

## 🏗️ التقنيات المستخدمة

- **Backend**: Node.js + Express.js + MongoDB + Mongoose
- **Frontend**: React.js + React Router DOM
- **Auth**: JWT (JSON Web Tokens) + bcryptjs
- **Stack**: MERN Full Stack

---

## 📁 هيكل المشروع

```
sportif-tn/
├── backend/
│   ├── models/         # User, News, Match, Video, Star, Article
│   ├── routes/         # auth, news, matches, videos, stars, articles, admin
│   ├── middleware/     # auth.js (protect, adminOnly)
│   ├── server.js
│   ├── seed.js         # بيانات تجريبية
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── context/    # AuthContext
│   │   ├── pages/
│   │   │   ├── user/   # Home, News, Matches, Videos, Stars, Articles, Login, Register
│   │   │   └── admin/  # Dashboard, News, Matches, Videos, Stars, Articles, Users
│   │   └── components/
│   │       └── common/ # Navbar, Footer
└── docker-compose.yml
```

---

## 🚀 التشغيل المحلي

### 1. المتطلبات
- Node.js >= 18
- MongoDB (محلي أو Atlas)

### 2. تشغيل Backend

```bash
cd backend
npm install
cp .env.example .env
# عدّل .env وأضف MONGO_URI و JWT_SECRET
npm run seed    # إضافة بيانات تجريبية (اختياري)
npm run dev     # يعمل على http://localhost:5000
```

### 3. تشغيل Frontend

```bash
cd frontend
npm install
npm start       # يعمل على http://localhost:3000
```

### 4. أو بـ Docker Compose (الأسهل)

```bash
docker-compose up --build
```
الموقع: http://localhost:3000

---

## 👤 حسابات الاختبار

| الدور  | البريد الإلكتروني     | كلمة المرور |
|--------|----------------------|-------------|
| مدير   | admin@sportif.tn     | admin123    |
| مستخدم | ahmed@sportif.tn     | user123     |

---

## 🔐 API Endpoints

### Auth
- `POST /api/auth/register` — تسجيل مستخدم جديد
- `POST /api/auth/login` — تسجيل الدخول
- `GET  /api/auth/me` — معلومات المستخدم الحالي

### News, Videos, Articles
- `GET    /api/news?page=1&limit=10&category=football`
- `GET    /api/news/:id`
- `POST   /api/news` — (admin only)
- `PUT    /api/news/:id` — (admin only)
- `DELETE /api/news/:id` — (admin only)

### Matches
- `GET /api/matches/today` — مباريات اليوم
- `GET /api/matches?status=live`

### Admin
- `GET /api/admin/stats` — إحصاءات عامة
- `GET /api/admin/users` — قائمة المستخدمين
- `PUT /api/admin/users/:id/role` — تغيير الدور

---

## 🎨 الأقسام

| القسم              | الرابط      |
|--------------------|-------------|
| آخر الأخبار        | /news       |
| مباريات اليوم       | /matches    |
| فيديوهات           | /videos     |
| نجوم               | /stars      |
| مقالات و تحليلات   | /articles   |
| لوحة الإدارة       | /admin      |

---

## 🌐 الميزات

- ✅ تصميم RTL عربي كامل
- ✅ لوحة إدارة كاملة (CRUD لكل الأقسام)
- ✅ نظام مصادقة JWT
- ✅ صفحات مستخدم وأدمن منفصلة
- ✅ ترقيم الصفحات (Pagination)
- ✅ فلترة حسب التصنيف
- ✅ عداد المشاهدات
- ✅ نظام الأخبار المميزة
- ✅ مباريات مباشرة (live) مع إشارة بصرية
- ✅ مشغّل فيديو YouTube مدمج
- ✅ جاهز للـ Docker
