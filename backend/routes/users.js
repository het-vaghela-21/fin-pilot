// backend/routes/users.js

const router = require('express').Router();
const bcrypt = require('bcryptjs');
let User = require('../models/user.model');

// REGISTRATION ENDPOINT (name, upiId, phone, password)
router.post('/register', async (req, res) => {
  try {
    const { name, upiId, phone, password } = req.body;
    if (!name || !upiId || !phone || !password) {
      return res.status(400).json({ msg: 'Please enter all fields (name, upiId, phone, password).' });
    }

    const existing = await User.findOne({ $or: [{ upiId }, { phone }] });
    if (existing) {
      return res.status(400).json({ msg: 'User with this UPI ID or phone already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ name, upiId, phone, password: passwordHash });
    const savedUser = await newUser.save();
    res.json({ id: savedUser._id, name: savedUser.name, upiId: savedUser.upiId, phone: savedUser.phone });
  } catch (err) {
    if (err?.code === 11000) {
      // duplicate key error
      const key = Object.keys(err.keyPattern || {})[0] || 'field';
      return res.status(409).json({ msg: `A user with this ${key} already exists.` });
    }
    if (err?.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: 'Internal server error', error: err.message });
  }
});

// LOGIN ENDPOINT (by upiId or phone + password)
router.post('/login', async (req, res) => {
  try {
    const { upiId, phone, password } = req.body;
    if ((!upiId && !phone) || !password) {
      return res.status(400).json({ msg: 'Provide upiId or phone and password.' });
    }

    // Special admin login (no DB record required)
    if (upiId === 'admin' && password === '2005') {
      return res.json({ id: 'admin', name: 'Administrator', upiId: 'admin', phone: '', role: 'admin' });
    }

    const user = await User.findOne(upiId ? { upiId } : { phone });
    if (!user) return res.status(400).json({ msg: 'User not found.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' });

    res.json({ id: user._id, name: user.name, upiId: user.upiId, phone: user.phone, role: 'user' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: list users (basic info)
router.get('/all', async (req, res) => {
  try {
    const users = await User.find({}, { name: 1, upiId: 1, phone: 1 }).sort({ createdAt: -1 });
    res.json(users.map(u => ({ id: u._id, name: u.name, upiId: u.upiId, phone: u.phone })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FORGOT PASSWORD: verify name+upiId, set new password
router.post('/forgot', async (req, res) => {
  try {
    const { name, upiId, newPassword } = req.body;
    if (!name || !upiId || !newPassword) {
      return res.status(400).json({ msg: 'Provide name, upiId and newPassword.' });
    }
    const user = await User.findOne({ upiId });
    if (!user) return res.status(404).json({ msg: 'User not found.' });
    if (user.name !== name) return res.status(400).json({ msg: 'Name does not match our records.' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    user.password = hash;
    await user.save();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;