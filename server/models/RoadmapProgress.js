// models/RoadmapProgress.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoadmapProgressSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  roadmap: {
    type: Schema.Types.ObjectId,
    ref: 'Roadmap',
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  skillProgress: [{
    skill: {
      type: Schema.Types.ObjectId,
      ref: 'Skill'
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completed: {
      type: Boolean,
      default: false
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index to ensure a student can have only one progress record per roadmap
RoadmapProgressSchema.index({ student: 1, roadmap: 1 }, { unique: true });

module.exports = mongoose.model('RoadmapProgress', RoadmapProgressSchema);