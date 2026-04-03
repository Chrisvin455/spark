import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get personalized stats for the User
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('totalWordsWritten level badges writingHistory streak points');
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sync word count on save and check for milestones
router.post('/sync-words', requireAuth, async (req, res) => {
  try {
    const { wordsAdded } = req.body;
    if (!wordsAdded || wordsAdded <= 0) return res.status(200).json({ status: "skipped" });

    const user = await User.findById(req.user.id);
    
    // Increment total words
    user.totalWordsWritten += wordsAdded;
    
    // Add to history today
    const today = new Date().setHours(0,0,0,0);
    const existingLog = user.writingHistory.find(log => new Date(log.date).setHours(0,0,0,0) === today);
    if (existingLog) {
      existingLog.wordsAdded += wordsAdded;
    } else {
      user.writingHistory.push({ date: Date.now(), wordsAdded });
    }

    // Milestones Check
    let newBadges = [];
    if (user.totalWordsWritten > 1000 && !user.badges.some(b => b.name === 'Novice Wordsmith')) {
        newBadges.push({ name: 'Novice Wordsmith', icon: 'Pencil' });
    }
    if (user.totalWordsWritten > 10000 && !user.badges.some(b => b.name === 'Apprentice Author')) {
      newBadges.push({ name: 'Apprentice Author', icon: 'Book' });
    }
    // Level up logic (1 level per 5000 words)
    const activeLevel = Math.floor(user.totalWordsWritten / 5000) + 1;
    if (activeLevel > user.level) {
      user.level = activeLevel;
    }

    if (newBadges.length > 0) {
      user.badges.push(...newBadges);
    }

    await user.save();
    
    res.status(200).json({ wordCount: user.totalWordsWritten, level: user.level, newBadges });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
