const express = require('express');
const router = express.Router();
const User = require('../models/User');
const News = require('../models/News');
const Match = require('../models/Match');
const Video = require('../models/Video');
const Star = require('../models/Star');
const Article = require('../models/Article');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [users, news, matches, videos, stars, articles] = await Promise.all([
      User.countDocuments(),
      News.countDocuments(),
      Match.countDocuments(),
      Video.countDocuments(),
      Star.countDocuments(),
      Article.countDocuments()
    ]);
    res.json({ users, news, matches, videos, stars, articles });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/users/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
