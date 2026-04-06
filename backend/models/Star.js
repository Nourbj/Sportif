const mongoose = require('mongoose');

const starSchema = new mongoose.Schema({
  name: { type: String },
  nameAr: { type: String, required: true },
  sport: { type: String, required: true },
  nationality: { type: String },
  nationalityAr: { type: String },
  nationalityFlag: { type: String, default: '' },
  club: { type: String },
  clubAr: { type: String },
  position: { type: String },
  age: { type: Number },
  image: { type: String, default: '' },
  bio: { type: String },
  bioAr: { type: String },
  stats: { type: Object, default: {} },
  featured: { type: Boolean, default: false },
  videoUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Star', starSchema);
