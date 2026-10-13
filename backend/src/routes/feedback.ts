
import { Router } from 'express';
import Feedback from '../models/feedback.js';

const router = Router();

router.post('/', async (req, res) => {
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

    const numericRating = Number(rating);

    if (
      rating === undefined ||
      rating === null ||
      rating === '' ||
      !Number.isFinite(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        error: 'Rating must be between 1 and 5.'
      });
    }

    if (!String(feedback).trim()) {
      return res.status(400).json({
        error: 'Feedback message is required.'
      });
    }

    const newFeedback = await Feedback.create({
      id: `feedback_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      user_id: String(user_id),
      name: String(name),
      email: String(email),
      rating: numericRating,
      category: String(category),
      experience: String(experience),
      feedback: String(feedback).trim(),
      improvements: Array.isArray(improvements)
        ? improvements.map(String)
        : [],
      created_at: new Date().toISOString()
    });

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

router.get('/', async (_req, res) => {
  try {
    const feedbackEntries = await Feedback.find()
      .sort({ created_at: -1 })
      .lean();

    return res.json(feedbackEntries);
  } catch (error) {
    console.error('Unable to load feedback:', error);

    return res.status(500).json({
      error: 'Unable to load feedback.'
    });
  }
});

export { router as feedbackRouter };
