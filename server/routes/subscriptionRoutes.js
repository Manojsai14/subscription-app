const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const { calculateLeakage } = require('../utils/leakageDetector');
const authMiddleware = require('../middleware/auth');

// All routes below require login
router.use(authMiddleware);

// GET all subscriptions
router.get('/', async (req, res) => {
  try {
    const subs = await Subscription.find({ userId: req.userId });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET leakage analysis
router.get('/leakage', async (req, res) => {
  try {
    const subs = await Subscription.find({ userId: req.userId, isActive: true });
    const analyzed = subs.map(calculateLeakage);
    const sorted = analyzed.sort((a, b) => b.leakageScore - a.leakageScore);
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add new subscription
router.post('/', async (req, res) => {
  try {
    const sub = new Subscription({ ...req.body, userId: req.userId });
    const saved = await sub.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update subscription
router.put('/:id', async (req, res) => {
  try {
    const updated = await Subscription.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE subscription
router.delete('/:id', async (req, res) => {
  try {
    await Subscription.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH log usage (mark as used today)
router.patch('/:id/log-usage', async (req, res) => {
  try {
    const updated = await Subscription.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { lastUsedDate: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;