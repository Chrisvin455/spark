import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  promptRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Prompt', default: null },
  content: { type: String, default: '' },
  wordCount: { type: Number, default: 0 },
  published: { type: Boolean, default: false },
  views: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Story', storySchema);
