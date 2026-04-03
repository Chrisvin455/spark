import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Prompt from '../models/Prompt.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get recent or random prompts (for home page)
router.get('/', async (req, res) => {
  try {
    const prompts = await Prompt.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json(prompts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get the current daily prompt
router.get('/daily', async (req, res) => {
  try {
    const dailyPrompt = await Prompt.findOne({ isDaily: true });
    res.status(200).json(dailyPrompt || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a random prompt via DB aggregation
router.get('/random', async (req, res) => {
  try {
    const random = await Prompt.aggregate([{ $sample: { size: 1 } }]);
    res.status(200).json(random[0] || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search prompts
router.get('/search', async (req, res) => {
  try {
    const { term, genre, difficulty } = req.query;
    let query = {};
    if (term) query.text = { $regex: term, $options: 'i' };
    if (genre && genre !== 'All') query.genre = genre;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
    
    const prompts = await Prompt.find(query).sort({ createdAt: -1 }).limit(50);
    res.status(200).json(prompts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate a new AI Prompt using Gemini
router.post('/generate', async (req, res) => {
  try {
    const { genre, mood, difficulty, twist, customizationHistory } = req.body;
    
    // Make sure API Key is set
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API Key is not configured." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let historyContext = "";
    if (customizationHistory) {
      historyContext = `The user enjoys these tropes/themes implicitly: ${customizationHistory}. Tie these loosely into the resulting prompt so it feels tailored to them, but don't ignore the current explicit requirements.`;
    }

    const promptText = `
      You are an expert creative writing assistant. 
      Generate a single, completely unique and creative writing prompt based on the following criteria:
      - Genre: ${genre}
      - Mood: ${mood}
      - Difficulty Level: ${difficulty}
      - Special Twist/Element: ${twist}

      ${historyContext}

      Requirements:
      1. Provide ONLY the writing prompt text itself. No introductory or concluding text.
      2. Ensure the prompt is highly detailed, evocative, and instantly sparks imagination.
      3. Length should be between 2 to 5 sentences.
      4. Make sure it explicitly incorporates the genre, mood, and special twist requested.
    `;

    const result = await model.generateContent(promptText);
    const response = await result.response;
    const text = response.text().trim();

    // Optionally save it to the DB or just return it to the frontend to let the user save it
    // For now we'll create a record with generatedBy = null (or user ID if logged in, but this route is public for testability, let's keep it simple)
    const newPrompt = new Prompt({
      text,
      genre,
      mood,
      difficulty,
      twist
    });

    await newPrompt.save();

    res.status(200).json(newPrompt);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    res.status(500).json({ error: 'Failed to generate prompt. Please try again later.' });
  }
});

export default router;
