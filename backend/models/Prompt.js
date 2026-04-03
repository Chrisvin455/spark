import mongoose from 'mongoose';

const promptSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  twist: {
    type: String,
    default: 'None'
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null if system generated
  },
  likes: {
    type: Number,
    default: 0
  },
  isDaily: {
    type: Boolean,
    default: false
  },
  dailyDate: {
    type: Date,
    default: null
  }
}, { timestamps: true });

export default mongoose.model('Prompt', promptSchema);
