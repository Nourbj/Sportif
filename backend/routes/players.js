const router = require('express').Router();
const Player = require('../models/Player');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    const filter = {};
    if (featured) filter.featured = true;
    const players = await Player.find(filter).sort({ createdAt: -1 });
    res.json(players);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'غير موجود' });
    res.json(player);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const player = await Player.create(req.body);
    res.status(201).json(player);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(player);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم الحذف' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
