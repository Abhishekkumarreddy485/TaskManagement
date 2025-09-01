const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// ====================
// Register Route
// ====================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please provide name, email, and password' });
    }

    // Convert email to lowercase before checking and saving
    const lowercasedEmail = email.toLowerCase();

    // Check if user already exists
    const existing = await User.findOne({ email: lowercasedEmail });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({ name, email: lowercasedEmail, password: hash });
    await user.save();

    // Create JWT token
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ====================
// Login Route
// ====================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password)
      return res.status(400).json({ msg: 'Please provide email and password' });

    // Convert email to lowercase to match the database schema
    const lowercasedEmail = email.toLowerCase();
    
    const user = await User.findOne({ email: lowercasedEmail });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ====================
// Seed Demo User (Optional)
// ====================
router.get('/seed', async (req, res) => {
  try {
    const existing = await User.findOne({ email: 'demo@local.test' });
    if (existing) return res.json({ msg: 'Demo user already exists' });

    const hash = await bcrypt.hash('password123', 10);
    const user = new User({ name: 'Demo User', email: 'demo@local.test', password: hash });
    await user.save();

    res.json({ msg: 'Demo user created', user: { email: user.email, password: 'password123' } });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;