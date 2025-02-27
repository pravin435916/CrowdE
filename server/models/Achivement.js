// models/Achievement.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AchievementSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String
  },
  type: {
    type: String,
    enum: ['SKILLS_COUNT', 'STREAK', 'LEVEL', 'POINTS', 'ROADMAP_COMPLETED'],
    required: true
  },
  threshold: {
    type: Number,
    required: true
  },
  pointsAwarded: {
    type: Number,
    default: 50
  },
  completedBy: [{
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student'
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Achievement', AchievementSchema);