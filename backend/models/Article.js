const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String },
  titleAr: { type: String, required: true },
  content: { type: String },
  contentAr: { type: String, required: true },
  image: { type: String, default: '' },
  type: { type: String, enum: ['analysis', 'opinion', 'report'], default: 'analysis' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  views: { type: Number, default: 0 },
  videoUrl: { type: String, default: '' },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', articleSchema);
