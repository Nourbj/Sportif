const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameAr: { type: String, required: true },
  position: { type: String, required: true },
  nationality: { type: String, required: true },
  nationalityFlag: { type: String, default: '' },
  club: { type: String, required: true },
  age: { type: Number },
  image: { type: String, default: '' },
  bio: { type: String },
  stats: {
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    matches: { type: Number, default: 0 },
    rating: { type: Number, default: 0 }
  },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Player', playerSchema);
