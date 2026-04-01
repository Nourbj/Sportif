const mongoose = require('mongoose');

const starSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameAr: { type: String, required: true },
  sport: { type: String, required: true },
  nationality: { type: String, required: true },
  nationalityAr: { type: String },
  club: { type: String },
  clubAr: { type: String },
  image: { type: String, default: '' },
  bio: { type: String },
  bioAr: { type: String },
  stats: { type: Object, default: {} },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Star', starSchema);
