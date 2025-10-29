const router = require('express').Router();
const Goal = require('../models/goal.model');

// Get goal for a year (defaults to current year)
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId || 'demo';
    const year = Number(req.query.year) || new Date().getFullYear();
    const goal = await Goal.findOne({ userId, year });
    res.json(goal || { userId, year, amount: 0, title: '' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upsert goal for a year
router.post('/', async (req, res) => {
  try {
    const userId = req.body.userId || 'demo';
    const year = Number(req.body.year) || new Date().getFullYear();
    const amount = Number(req.body.amount || 0);
    const title = String(req.body.title || '');
    const updated = await Goal.findOneAndUpdate(
      { userId, year },
      { $set: { amount, title } },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
