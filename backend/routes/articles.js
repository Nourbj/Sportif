const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const query = {};
    if (type) query.type = type;
    const articles = await Article.find(query).populate('author', 'name').sort('-createdAt')
      .limit(limit * 1).skip((page - 1) * limit);
    const total = await Article.countDocuments(query);
    res.json({ articles, total, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true }).populate('author', 'name');
    if (!article) return res.status(404).json({ message: 'Not found' });
    res.json(article);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body, author: req.user._id };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const article = await Article.create(data);
    res.status(201).json(article);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const article = await Article.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(article);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
