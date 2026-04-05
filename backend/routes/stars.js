const express = require('express');
const router = express.Router();
const Star = require('../models/Star');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', async (req, res) => {
  try {
    const { sport, featured, page, limit } = req.query;
    const query = {};
    if (sport) query.sport = sport;
    if (featured) query.featured = true;

    if (page || limit) {
      const pageNum = parseInt(page || 1, 10);
      const limitNum = parseInt(limit || 10, 10);
      const stars = await Star.find(query).sort('-createdAt')
        .limit(limitNum).skip((pageNum - 1) * limitNum);
      const total = await Star.countDocuments(query);
      return res.json({ stars, total, pages: Math.ceil(total / limitNum) });
    }

    const stars = await Star.find(query).sort('-createdAt');
    res.json(stars);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const star = await Star.findById(req.params.id);
    if (!star) return res.status(404).json({ message: 'Not found' });
    res.json(star);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const star = await Star.create(data);
    res.status(201).json(star);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const star = await Star.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(star);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Star.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
