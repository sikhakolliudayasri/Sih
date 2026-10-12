
import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../data');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');

interface FeedbackEntry {
  id: string;
  user_id: string;
  name: string;
  email: string;
  rating: number;
  category: string;
  experience: string;
  feedback: string;
  improvements: string[];
  created_at: string;
}

const ensureFeedbackFile = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(FEEDBACK_FILE)) {
    fs.writeFileSync(FEEDBACK_FILE, '[]', 'utf-8');
  }
};

router.post('/', (req, res) => {
  try {
    const {
      user_id = 'guest_user',
      name = 'Anonymous Citizen',
      email = '',
      rating,
      category = 'Overall Experience',
      experience = '',
      feedback = '',
      improvements = []
    } = req.body || {};

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Rating must be between 1 and 5.'
      });
    }

    if (!String(feedback).trim()) {
      return res.status(400).json({
        error: 'Feedback message is required.'
      });
    }

    ensureFeedbackFile();

    const existingData = fs.readFileSync(
      FEEDBACK_FILE,
      'utf-8'
    );

    const feedbackEntries: FeedbackEntry[] =
      JSON.parse(existingData || '[]');

    const newFeedback: FeedbackEntry = {
      id: `feedback_${Date.now()}`,
      user_id: String(user_id),
      name: String(name),
      email: String(email),
      rating: Number(rating),
      category: String(category),
      experience: String(experience),
      feedback: String(feedback).trim(),
      improvements: Array.isArray(improvements)
        ? improvements.map(String)
        : [],
      created_at: new Date().toISOString()
    };

    feedbackEntries.unshift(newFeedback);

    fs.writeFileSync(
      FEEDBACK_FILE,
      JSON.stringify(feedbackEntries, null, 2),
      'utf-8'
    );

    return res.status(201).json({
      ok: true,
      message: 'Feedback submitted successfully.',
      feedback: newFeedback
    });

  } catch (error) {
    console.error('Feedback submission failed:', error);

    return res.status(500).json({
      error: 'Unable to save feedback.'
    });
  }
});

router.get('/', (_req, res) => {
  try {
    ensureFeedbackFile();

    const data = fs.readFileSync(
      FEEDBACK_FILE,
      'utf-8'
    );

    return res.json(JSON.parse(data || '[]'));

  } catch (error) {
    console.error('Unable to read feedback:', error);

    return res.status(500).json({
      error: 'Unable to load feedback.'
    });
  }
});

export { router as feedbackRouter };
