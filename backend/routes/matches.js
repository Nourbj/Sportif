const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { date, status, page, limit } = req.query;
    const query = {};
    if (status) query.status = status;
    if (date) {
      const d = new Date(date);
      const next = new Date(date);
      next.setDate(next.getDate() + 1);
      query.date = { $gte: d, $lt: next };
    }

    if (page || limit) {
      const pageNum = parseInt(page || 1, 10);
      const limitNum = parseInt(limit || 10, 10);
      const matches = await Match.find(query).sort('date')
        .limit(limitNum).skip((pageNum - 1) * limitNum);
      const total = await Match.countDocuments(query);
      return res.json({ matches, total, pages: Math.ceil(total / limitNum) });
    }

    const matches = await Match.find(query).sort('date');
    res.json(matches);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const matches = await Match.find({ date: { $gte: today, $lt: tomorrow } }).sort('date');
    res.json(matches);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const match = await Match.create(req.body);
    res.status(201).json(match);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(match);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Match.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
