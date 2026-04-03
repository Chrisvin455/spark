import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prompt' }],
  points: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastLogin: { type: Date, default: Date.now },
  
  // SaaS Extended Analytics and Gamification
  totalWordsWritten: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [{ 
    name: String,
    unlockedAt: { type: Date, default: Date.now },
    icon: String
  }],
  writingHistory: [{
    date: { type: Date, default: Date.now },
    wordsAdded: { type: Number, default: 0 }
  }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
