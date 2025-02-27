const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  // Gamification elements
  level: {
    type: Number,
    default: 1
  },
  experience: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  skills: [{
    type: Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  badges: [{
    badge: {
      type: Schema.Types.ObjectId,
      ref: 'Badge'
    },
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  achievements: [{
    type: Schema.Types.ObjectId,
    ref: 'Achievement'
  }],
  activeRoadmaps: [{
    type: Schema.Types.ObjectId,
    ref: 'Roadmap'
  }],
  completedRoadmaps: [{
    type: Schema.Types.ObjectId,
    ref: 'Roadmap'
  }],
  recentActivity: [{
    type: {
      type: String,
      enum: [
        'SKILL_COMPLETED', 
        'ACHIEVEMENT_UNLOCKED', 
        'LEVEL_UP', 
        'ROADMAP_STARTED', 
        'ROADMAP_COMPLETED',
        'ROADMAP_SKILL_COMPLETED',
        'BADGE_EARNED'
      ],
      required: true
    },
    data: {
      type: Schema.Types.Mixed
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', StudentSchema);