const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: true },
  homeTeamLogo: { type: String, default: '' },
  awayTeamLogo: { type: String, default: '' },
  homeScore: { type: Number, default: null },
  awayScore: { type: Number, default: null },
  date: { type: Date, required: true },
  competition: { type: String, required: true },
  status: { type: String, enum: ['upcoming', 'live', 'finished'], default: 'upcoming' },
  venue: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Match', matchSchema);
