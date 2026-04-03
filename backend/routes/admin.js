import express from 'express';
import Prompt from '../models/Prompt.js';
import { requireAuth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);
router.use(isAdmin);

// Create manual prompt
router.post('/', async (req, res) => {
  try {
    const prompt = await Prompt.create(req.body);
    res.status(201).json(prompt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete prompt
router.delete('/:id', async (req, res) => {
  try {
    await Prompt.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Set Daily Prompt manually
router.post('/:id/set-daily', async (req, res) => {
  try {
    // Clear existing daily
    await Prompt.updateMany({ isDaily: true }, { isDaily: false });
    
    const newDaily = await Prompt.findByIdAndUpdate(req.params.id, {
      isDaily: true,
      dailyDate: new Date()
    }, { new: true });
    
    res.status(200).json(newDaily);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
