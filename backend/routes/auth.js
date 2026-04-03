import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return res.status(400).json({ error: 'Username or email already in use.' });
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id, user.role);

    res.status(201).json({ 
      user: { id: user._id, username: user.username, email: user.email, points: user.points, streak: user.streak, role: user.role },
      token 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = generateToken(user._id, user.role);

    // Update streak (simplified logic: check if lastLogin was yesterday, else reset/keep)
    const now = new Date();
    const lastLogin = new Date(user.lastLogin);
    const diffTime = Math.abs(now - lastLogin);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      user.streak += 1;
    } else if (diffDays > 1) {
      user.streak = 0; // reset streak if missed a day
    }
    user.lastLogin = now;
    await user.save();

    res.status(200).json({ 
      user: { id: user._id, username: user.username, email: user.email, points: user.points, streak: user.streak, role: user.role },
      token 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Profile
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle Favorite
router.post('/favorites', requireAuth, async (req, res) => {
  try {
    const { promptId } = req.body;
    const user = await User.findById(req.user.id);
    
    if (user.favorites.includes(promptId)) {
      user.favorites = user.favorites.filter(id => id.toString() !== promptId);
    } else {
      user.favorites.push(promptId);
    }
    
    await user.save();
    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
