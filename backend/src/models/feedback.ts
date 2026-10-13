
import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    user_id: {
      type: String,
      default: 'guest_user'
    },
    name: {
      type: String,
      default: 'Anonymous Citizen'
    },
    email: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    category: {
      type: String,
      default: 'Overall Experience'
    },
    experience: {
      type: String,
      default: ''
    },
    feedback: {
      type: String,
      required: true,
      trim: true
    },
    improvements: {
      type: [String],
      default: []
    },
    created_at: {
      type: String,
      default: () => new Date().toISOString()
    }
  },
  {
    collection: 'feedback',
    versionKey: false
  }
);

const Feedback =
  mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

export default Feedback;
